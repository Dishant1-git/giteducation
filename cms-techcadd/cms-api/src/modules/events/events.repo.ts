import { randomUUID } from 'node:crypto'
import type {
  ExecuteValues,
  PoolConnection,
  ResultSetHeader,
  RowDataPacket,
} from 'mysql2/promise'

import { toStorableId } from '../../db/ids.js'
import { query, queryOne, transaction, type Row } from '../../db/pool.js'
import { notFound, unprocessable } from '../../http/errors.js'
import {
  buildFilters,
  resolveSort,
  type ListParams,
  type ListResult,
} from '../../http/listParams.js'
import type {
  EventAgendaInput,
  EventHighlightInput,
  EventImageInput,
  EventInput,
  EventPatch,
  EventSpeakerInput,
} from './events.schema.js'

const SORTABLE: Record<string, string> = {
  title: 'e.title',
  slug: 'e.slug',
  status: 'e.status',
  startsOn: 'e.starts_on',
  eventType: 'e.event_type',
  createdAt: 'e.created_at',
  updatedAt: 'e.updated_at',
}

const FILTERABLE: Record<string, string> = {
  status: 'e.status',
  eventType: 'e.event_type',
  mode: 'e.mode',
  featured: 'e.featured',
  startsOn: 'e.starts_on',
  createdAt: 'e.created_at',
  updatedAt: 'e.updated_at',
}

interface Children {
  tags: string[]
  highlights: unknown[]
  agenda: unknown[]
  speakers: unknown[]
  images: unknown[]
}

const EMPTY: Children = { tags: [], highlights: [], agenda: [], speakers: [], images: [] }

/**
 * `HH:MM:SS` from MySQL back to the `HH:MM` a browser time input understands.
 *
 * Trimmed here rather than in the form: `<input type="time">` silently rejects
 * a value with seconds in some browsers and shows an empty box, which reads as
 * "the time was not saved" when it was.
 */
function toTime(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value) return undefined
  return value.slice(0, 5)
}

function toEvent(row: Row, children: Children): unknown {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    eventType: row.event_type,
    mode: row.mode,
    summary: row.summary,
    body: row.body,
    coverImage: row.cover_image_id
      ? { id: row.cover_image_id, url: row.cover_url, alt: row.cover_alt ?? '' }
      : undefined,

    startsOn: row.starts_on,
    endsOn: row.ends_on ?? undefined,
    startTime: toTime(row.start_time),
    endTime: toTime(row.end_time),

    venueName: row.venue_name ?? undefined,
    venueAddress: row.venue_address ?? undefined,
    city: row.city ?? undefined,
    mapUrl: row.map_url ?? undefined,
    hostName: row.host_name ?? undefined,

    registrationUrl: row.registration_url ?? undefined,
    seats: row.seats === null || row.seats === undefined ? undefined : Number(row.seats),

    tags: children.tags,
    highlights: children.highlights,
    agenda: children.agenda,
    speakers: children.speakers,
    images: children.images,

    featured: Boolean(row.featured),
    seo: {
      metaTitle: row.meta_title ?? undefined,
      metaDescription: row.meta_description ?? undefined,
      keywords: (row.meta_keywords as string[] | null) ?? [],
      ogImage: row.og_image_id
        ? { id: row.og_image_id, url: row.og_url, alt: row.og_alt ?? '' }
        : undefined,
      canonicalUrl: row.canonical_url ?? undefined,
    },
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * Every child row for the whole page, in five queries rather than five per
 * event.
 *
 * A listing of twenty events would otherwise be a hundred round trips, and the
 * CMS list page asks for a hundred at a time.
 */
async function loadChildren(ids: string[]): Promise<Map<string, Children>> {
  const map = new Map<string, Children>()
  if (ids.length === 0) return map
  for (const id of ids) {
    map.set(id, { tags: [], highlights: [], agenda: [], speakers: [], images: [] })
  }

  const holes = ids.map(() => '?').join(',')

  const [tags, highlights, agenda, speakers, images] = await Promise.all([
    query<Row>(
      `SELECT et.event_id, t.name FROM event_tags et
         JOIN tags t ON t.id = et.tag_id
        WHERE et.event_id IN (${holes}) ORDER BY et.position`,
      ids,
    ),
    query<Row>(
      `SELECT id, event_id, text, position FROM event_highlights
        WHERE event_id IN (${holes}) ORDER BY position`,
      ids,
    ),
    query<Row>(
      `SELECT id, event_id, time_label, title, detail, position FROM event_agenda
        WHERE event_id IN (${holes}) ORDER BY position`,
      ids,
    ),
    query<Row>(
      `SELECT s.id, s.event_id, s.name, s.role, s.org, s.bio, s.position,
              m.id AS photo_id, m.url AS photo_url, m.alt AS photo_alt
         FROM event_speakers s
         LEFT JOIN media m ON m.id = s.photo_id
        WHERE s.event_id IN (${holes}) ORDER BY s.position`,
      ids,
    ),
    query<Row>(
      `SELECT i.id, i.event_id, i.caption, i.position,
              m.id AS media_id, m.url, m.alt, m.width, m.height
         FROM event_images i
         JOIN media m ON m.id = i.media_id
        WHERE i.event_id IN (${holes}) ORDER BY i.position`,
      ids,
    ),
  ])

  for (const row of tags) {
    map.get(row.event_id as string)?.tags.push(row.name as string)
  }

  for (const row of highlights) {
    map.get(row.event_id as string)?.highlights.push({
      id: row.id,
      text: row.text,
      order: Number(row.position),
    })
  }

  for (const row of agenda) {
    map.get(row.event_id as string)?.agenda.push({
      id: row.id,
      timeLabel: row.time_label ?? undefined,
      title: row.title,
      detail: row.detail ?? undefined,
      order: Number(row.position),
    })
  }

  for (const row of speakers) {
    map.get(row.event_id as string)?.speakers.push({
      id: row.id,
      name: row.name,
      role: row.role ?? undefined,
      org: row.org ?? undefined,
      bio: row.bio ?? undefined,
      photo: row.photo_id
        ? { id: row.photo_id, url: row.photo_url, alt: row.photo_alt ?? '' }
        : undefined,
      order: Number(row.position),
    })
  }

  for (const row of images) {
    map.get(row.event_id as string)?.images.push({
      id: row.id,
      media: {
        id: row.media_id,
        url: row.url,
        alt: row.alt ?? '',
        width: row.width ?? undefined,
        height: row.height ?? undefined,
      },
      caption: row.caption ?? undefined,
      order: Number(row.position),
    })
  }

  return map
}

const SELECT_EVENT = `
  SELECT e.*,
         c.url AS cover_url, c.alt AS cover_alt,
         o.url AS og_url,    o.alt AS og_alt
    FROM events e
    LEFT JOIN media c ON c.id = e.cover_image_id
    LEFT JOIN media o ON o.id = e.og_image_id
`

export async function list(params: ListParams): Promise<ListResult<unknown>> {
  const { sql: filterSql, params: filterParams } = buildFilters(params.filters, FILTERABLE)
  const { column, dir } = resolveSort(params.sort, SORTABLE, {
    column: 'e.starts_on',
    dir: 'desc',
  })

  // Tags, the venue and the host live outside the main columns, so the search
  // reaches into them — "Alpine" should find the seminar run there.
  const searchSql = params.search
    ? ` AND (e.title LIKE ? OR e.slug LIKE ? OR e.summary LIKE ?
             OR e.venue_name LIKE ? OR e.host_name LIKE ? OR e.city LIKE ?
             OR EXISTS (SELECT 1 FROM event_tags et JOIN tags t ON t.id = et.tag_id
                          WHERE et.event_id = e.id AND t.name LIKE ?))`
    : ''
  const like = `%${params.search ?? ''}%`
  const searchParams = params.search ? Array(7).fill(like) : []

  const where = `WHERE 1=1${filterSql}${searchSql}`
  const whereParams = [...filterParams, ...searchParams]

  const totalRow = await queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total FROM events e ${where}`,
    whereParams,
  )

  const offset = (params.page - 1) * params.pageSize
  const rows = await query<Row>(
    `${SELECT_EVENT} ${where} ORDER BY ${column} ${dir}, e.start_time IS NULL, e.start_time LIMIT ? OFFSET ?`,
    [...whereParams, params.pageSize, offset],
  )

  const children = await loadChildren(rows.map((row) => row.id as string))

  return {
    items: rows.map((row) => toEvent(row, children.get(row.id as string) ?? EMPTY)),
    total: Number(totalRow?.total ?? 0),
    page: params.page,
    pageSize: params.pageSize,
  }
}

export async function get(id: string): Promise<unknown> {
  const row = await queryOne<Row>(`${SELECT_EVENT} WHERE e.id = ? LIMIT 1`, [id])
  if (!row) throw notFound('Event')

  const children = await loadChildren([id])
  return toEvent(row, children.get(id) ?? EMPTY)
}

/** The one the website asks for by slug, published only. */
export async function getPublishedBySlug(slug: string): Promise<unknown> {
  const row = await queryOne<Row>(
    `${SELECT_EVENT} WHERE e.slug = ? AND e.status = 'published' LIMIT 1`,
    [slug],
  )
  if (!row) throw notFound('Event')

  const children = await loadChildren([row.id as string])
  return toEvent(row, children.get(row.id as string) ?? EMPTY)
}

/** The slug is the public URL, so a clash would make one event unreachable. */
async function assertSlugFree(slug: string, exceptId?: string): Promise<void> {
  const clash = await queryOne<{ id: string }>(
    `SELECT id FROM events WHERE slug = ?${exceptId ? ' AND id <> ?' : ''} LIMIT 1`,
    exceptId ? [slug, exceptId] : [slug],
  )
  if (clash) throw unprocessable({ slug: 'This slug is already in use.' })
}

/**
 * The slug a tag is matched and linked by.
 *
 * Identical to the one in blogs.repo.ts on purpose: the two modules share the
 * `tags` table, so if they derived slugs differently the same word typed on an
 * event and on a post would resolve to two rows — which is exactly what having
 * one table is meant to prevent.
 */
function slugifyTag(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function writeTags(
  connection: PoolConnection,
  eventId: string,
  tags: string[],
): Promise<void> {
  await connection.execute<ResultSetHeader>('DELETE FROM event_tags WHERE event_id = ?', [eventId])

  const seen = new Set<string>()
  let position = 0

  for (const raw of tags) {
    const name = raw.trim()
    if (!name) continue

    const slug = slugifyTag(name)
    if (!slug || seen.has(slug)) continue
    seen.add(slug)

    // INSERT IGNORE then read: the unique key on the slug decides, so two
    // people adding the same new tag at the same moment still get one row.
    await connection.execute<ResultSetHeader>(
      'INSERT IGNORE INTO tags (id, name, slug, created_at) VALUES (?, ?, ?, NOW(3))',
      [randomUUID(), name, slug],
    )

    const [found] = await connection.query<RowDataPacket[]>(
      'SELECT id FROM tags WHERE slug = ? LIMIT 1',
      [slug],
    )
    const tagId = found[0]?.id as string | undefined
    if (!tagId) continue

    await connection.execute<ResultSetHeader>(
      'INSERT INTO event_tags (event_id, tag_id, position) VALUES (?, ?, ?)',
      [eventId, tagId, position++],
    )
  }
}

/**
 * Replaces a child collection wholesale.
 *
 * Rewriting the set rather than diffing it makes reordering fall out for free:
 * `position` is the array index, so whatever order the form sent is what comes
 * back. The ids the form generated are kept when they are real UUIDs, which is
 * what stops a save from renumbering rows that did not change.
 */
async function writeHighlights(
  connection: PoolConnection,
  eventId: string,
  rows: EventHighlightInput[],
): Promise<void> {
  await connection.execute<ResultSetHeader>('DELETE FROM event_highlights WHERE event_id = ?', [
    eventId,
  ])
  for (const [index, item] of rows.entries()) {
    if (!item.text.trim()) continue
    await connection.execute<ResultSetHeader>(
      'INSERT INTO event_highlights (id, event_id, text, position) VALUES (?, ?, ?, ?)',
      [toStorableId(item.id), eventId, item.text.trim(), index] as ExecuteValues,
    )
  }
}

async function writeAgenda(
  connection: PoolConnection,
  eventId: string,
  rows: EventAgendaInput[],
): Promise<void> {
  await connection.execute<ResultSetHeader>('DELETE FROM event_agenda WHERE event_id = ?', [
    eventId,
  ])
  for (const [index, item] of rows.entries()) {
    if (!item.title.trim()) continue
    await connection.execute<ResultSetHeader>(
      `INSERT INTO event_agenda (id, event_id, time_label, title, detail, position)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        toStorableId(item.id),
        eventId,
        item.timeLabel?.trim() || null,
        item.title.trim(),
        item.detail?.trim() || null,
        index,
      ] as ExecuteValues,
    )
  }
}

async function writeSpeakers(
  connection: PoolConnection,
  eventId: string,
  rows: EventSpeakerInput[],
): Promise<void> {
  await connection.execute<ResultSetHeader>('DELETE FROM event_speakers WHERE event_id = ?', [
    eventId,
  ])
  for (const [index, item] of rows.entries()) {
    if (!item.name.trim()) continue
    await connection.execute<ResultSetHeader>(
      `INSERT INTO event_speakers (id, event_id, name, role, org, bio, photo_id, position)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        toStorableId(item.id),
        eventId,
        item.name.trim(),
        item.role?.trim() || null,
        item.org?.trim() || null,
        item.bio?.trim() || null,
        item.photo?.id ?? null,
        index,
      ] as ExecuteValues,
    )
  }
}

async function writeImages(
  connection: PoolConnection,
  eventId: string,
  rows: EventImageInput[],
): Promise<void> {
  await connection.execute<ResultSetHeader>('DELETE FROM event_images WHERE event_id = ?', [
    eventId,
  ])
  for (const [index, item] of rows.entries()) {
    await connection.execute<ResultSetHeader>(
      'INSERT INTO event_images (id, event_id, media_id, caption, position) VALUES (?, ?, ?, ?, ?)',
      [
        toStorableId(item.id),
        eventId,
        item.media.id,
        item.caption?.trim() || null,
        index,
      ] as ExecuteValues,
    )
  }
}

const COLUMNS = `title, slug, event_type, mode, summary, body, cover_image_id,
  starts_on, ends_on, start_time, end_time,
  venue_name, venue_address, city, map_url, host_name,
  registration_url, seats, featured, status,
  meta_title, meta_description, meta_keywords, og_image_id, canonical_url`

function values(input: EventInput): unknown[] {
  return [
    input.title,
    input.slug,
    input.eventType,
    input.mode,
    input.summary,
    input.body,
    input.coverImage?.id ?? null,
    input.startsOn,
    // '' means "no date"; DATE and TIME columns reject it outright.
    input.endsOn || null,
    input.startTime || null,
    input.endTime || null,
    input.venueName || null,
    input.venueAddress || null,
    input.city || null,
    input.mapUrl || null,
    input.hostName || null,
    input.registrationUrl || null,
    input.seats ?? null,
    input.featured ? 1 : 0,
    input.status,
    input.seo.metaTitle || null,
    input.seo.metaDescription || null,
    JSON.stringify(input.seo.keywords ?? []),
    input.seo.ogImage?.id ?? null,
    input.seo.canonicalUrl || null,
  ]
}

export async function create(input: EventInput): Promise<unknown> {
  await assertSlugFree(input.slug)

  const id = randomUUID()
  await transaction(async (connection) => {
    const count = COLUMNS.split(',').length
    await connection.execute<ResultSetHeader>(
      `INSERT INTO events (id, ${COLUMNS}, created_at, updated_at)
       VALUES (?, ${Array(count).fill('?').join(', ')}, NOW(3), NOW(3))`,
      [id, ...values(input)] as ExecuteValues,
    )
    await writeTags(connection, id, input.tags)
    await writeHighlights(connection, id, input.highlights)
    await writeAgenda(connection, id, input.agenda)
    await writeSpeakers(connection, id, input.speakers)
    await writeImages(connection, id, input.images)
  })

  return get(id)
}

/** Columns where '' means "clear this" — see the note in categories.repo.ts. */
const NULLABLE = new Set([
  'ends_on', 'start_time', 'end_time',
  'venue_name', 'venue_address', 'city', 'map_url', 'host_name',
  'registration_url',
  'meta_title', 'meta_description', 'canonical_url',
])

export async function update(id: string, patch: EventPatch): Promise<unknown> {
  const existing = await queryOne<Row>('SELECT id FROM events WHERE id = ? LIMIT 1', [id])
  if (!existing) throw notFound('Event')
  if (patch.slug !== undefined) await assertSlugFree(patch.slug, id)

  const mapping: Record<string, string> = {
    title: 'title',
    slug: 'slug',
    eventType: 'event_type',
    mode: 'mode',
    summary: 'summary',
    body: 'body',
    startsOn: 'starts_on',
    endsOn: 'ends_on',
    startTime: 'start_time',
    endTime: 'end_time',
    venueName: 'venue_name',
    venueAddress: 'venue_address',
    city: 'city',
    mapUrl: 'map_url',
    hostName: 'host_name',
    registrationUrl: 'registration_url',
    status: 'status',
  }

  await transaction(async (connection) => {
    const assignments: string[] = []
    const params: unknown[] = []

    for (const [key, column] of Object.entries(mapping)) {
      const value = patch[key as keyof EventPatch]
      if (value === undefined) continue
      assignments.push(`${column} = ?`)
      params.push(value === '' && NULLABLE.has(column) ? null : value)
    }

    // Outside the loop, all three: a boolean, a number that may legitimately
    // be null, and an object are each "cleared" by something other than ''.
    if (patch.featured !== undefined) {
      assignments.push('featured = ?')
      params.push(patch.featured ? 1 : 0)
    }

    if (patch.seats !== undefined) {
      assignments.push('seats = ?')
      params.push(patch.seats ?? null)
    }

    if (patch.coverImage !== undefined) {
      assignments.push('cover_image_id = ?')
      params.push(patch.coverImage?.id ?? null)
    }

    if (patch.seo !== undefined) {
      assignments.push(
        'meta_title = ?', 'meta_description = ?', 'meta_keywords = ?',
        'og_image_id = ?', 'canonical_url = ?',
      )
      params.push(
        patch.seo.metaTitle || null,
        patch.seo.metaDescription || null,
        JSON.stringify(patch.seo.keywords ?? []),
        patch.seo.ogImage?.id ?? null,
        patch.seo.canonicalUrl || null,
      )
    }

    if (assignments.length > 0) {
      await connection.execute<ResultSetHeader>(
        `UPDATE events SET ${assignments.join(', ')}, updated_at = NOW(3) WHERE id = ?`,
        [...params, id] as ExecuteValues,
      )
    }

    if (patch.tags !== undefined) await writeTags(connection, id, patch.tags)
    if (patch.highlights !== undefined) await writeHighlights(connection, id, patch.highlights)
    if (patch.agenda !== undefined) await writeAgenda(connection, id, patch.agenda)
    if (patch.speakers !== undefined) await writeSpeakers(connection, id, patch.speakers)
    if (patch.images !== undefined) await writeImages(connection, id, patch.images)
  })

  return get(id)
}

export async function remove(ids: string[]): Promise<void> {
  if (ids.length === 0) return
  // Every child table cascades; nothing outside this module points at an event.
  await query(`DELETE FROM events WHERE id IN (${ids.map(() => '?').join(',')})`, ids)
}
