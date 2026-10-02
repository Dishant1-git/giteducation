import { randomUUID } from 'node:crypto'
import type { PoolConnection, ResultSetHeader } from 'mysql2/promise'
import type { ExecuteValues } from 'mysql2'

import { query, queryOne, transaction, type Row } from '../../db/pool.js'
import { buildFilters, resolveSort, type ListParams, type ListResult } from '../../http/listParams.js'
import { notFound, unprocessable } from '../../http/errors.js'
import type { CourseInput } from './courses.schema.js'

/**
 * Sortable and filterable columns, whitelisted.
 *
 * Column names cannot be parameterised, so anything reaching an ORDER BY or
 * WHERE clause must come from these maps — never straight from the query string.
 */
const SORTABLE: Record<string, string> = {
  title: 'c.title',
  // The order the website lists them in: by category, oldest first, so a new
  // course joins the end of its group instead of jumping to the top.
  catalogue: 'cat.sort_order IS NULL, cat.sort_order ASC, c.created_at',
  status: 'c.status',
  createdAt: 'c.created_at',
  updatedAt: 'c.updated_at',
}

const FILTERABLE: Record<string, string> = {
  status: 'c.status',
  mode: 'c.mode',
  level: 'c.level',
  categoryId: 'c.category_id',
  createdAt: 'c.created_at',
  updatedAt: 'c.updated_at',
}

/** DB row → the JSON shape the CMS expects (camelCase, nested SEO). */
function toCourse(row: Row, children: Children): unknown {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    categoryId: row.category_id ?? undefined,
    // The name as well as the id: the website groups courses by category, and
    // making it fetch the category list separately to resolve a label is a
    // round trip for something the join already has.
    categoryName: row.category_name ?? undefined,
    categorySlug: row.category_slug ?? undefined,
    segment: row.segment ?? 'courses',
    careers: (row.careers as string[] | null) ?? [],
    tools: (row.tools as string[] | null) ?? [],
    shortDescription: row.short_description,
    duration: row.duration ?? undefined,
    level: row.level ?? undefined,
    icon: row.icon ?? undefined,
    levelLabel: row.level_label ?? undefined,
    feeAmount: row.fee_amount === null || row.fee_amount === undefined ? undefined : Number(row.fee_amount),
    feeInstallments: row.fee_installments ?? undefined,
    seats: row.seats === null || row.seats === undefined ? undefined : Number(row.seats),
    nextBatch: row.next_batch ?? undefined,
    weeklyHours: row.weekly_hours ?? undefined,
    // DECIMAL arrives as a string from the driver.
    ratingValue:
      row.rating_value === null || row.rating_value === undefined ? undefined : Number(row.rating_value),
    ratingCount:
      row.rating_count === null || row.rating_count === undefined ? undefined : Number(row.rating_count),
    modes: (row.modes as string[] | null) ?? [],
    languages: (row.languages as string[] | null) ?? [],
    batches: (row.batches as unknown[] | null) ?? [],
    mode: row.mode ?? undefined,
    thumbnail: row.thumbnail_id
      ? { id: row.thumbnail_id, url: row.thumbnail_url, alt: row.thumbnail_alt ?? '' }
      : undefined,
    syllabus: children.syllabus,
    highlights: children.highlights,
    audience: children.audience,
    benefits: children.benefits,
    careerRoles: children.careers,
    projects: children.projects,
    workflow: (children.points as { kind: string }[]).filter((p) => p.kind === 'workflow'),
    whyPoints: (children.points as { kind: string }[]).filter((p) => p.kind === 'why-techcadd'),
    comparisonRows: children.comparison,
    plans: children.plans,
    faqIds: children.faqIds,
    reviewIds: children.reviewIds,
    relatedIds: children.relatedIds,
    eyebrow: row.eyebrow ?? undefined,
    badge: row.badge ?? undefined,
    h1: row.h1 ?? undefined,
    intro: row.intro ?? undefined,
    ctaPrimary: row.cta_primary_text
      ? {
          text: row.cta_primary_text,
          type: row.cta_primary_type ?? 'enquiry',
          url: row.cta_primary_url ?? undefined,
        }
      : undefined,
    ctaSecondary: row.cta_secondary_text
      ? {
          text: row.cta_secondary_text,
          type: row.cta_secondary_type ?? 'contact',
          url: row.cta_secondary_url ?? undefined,
        }
      : undefined,
    overview: row.overview ?? undefined,
    videoUrl: row.video_url ?? undefined,
    videoTitle: row.video_title ?? undefined,
    eligibility: row.eligibility ?? undefined,
    certification: row.certification ?? undefined,
    seo: {
      metaTitle: row.meta_title ?? undefined,
      metaDescription: row.meta_description ?? undefined,
      keywords: (row.meta_keywords as string[] | null) ?? [],
      canonicalUrl: row.canonical_url ?? undefined,
      ogTitle: row.og_title ?? undefined,
      ogDescription: row.og_description ?? undefined,
      twitterTitle: row.twitter_title ?? undefined,
      twitterDescription: row.twitter_description ?? undefined,
      // Defaults match what the page emits today, so an untouched row reads
      // as "carry on doing what you were doing".
      robotsIndex: row.robots_index === undefined ? true : Boolean(row.robots_index),
      inSitemap: row.in_sitemap === undefined ? true : Boolean(row.in_sitemap),
      faqSchema: row.faq_schema === undefined ? true : Boolean(row.faq_schema),
    },
    publishedAt: row.published_at ?? undefined,
    scheduledFor: row.scheduled_for ?? undefined,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

interface Children {
  syllabus: unknown[]
  highlights: string[]
  audience: unknown[]
  benefits: unknown[]
  careers: unknown[]
  projects: unknown[]
  points: unknown[]
  comparison: unknown[]
  plans: unknown[]
  faqIds: string[]
  reviewIds: string[]
  relatedIds: string[]
}

const emptyChildren = (): Children => ({
  syllabus: [],
  highlights: [],
  audience: [],
  benefits: [],
  careers: [],
  projects: [],
  points: [],
  comparison: [],
  plans: [],
  faqIds: [],
  reviewIds: [],
  relatedIds: [],
})

const EMPTY: Children = emptyChildren()

/**
 * Loads every child row for a set of courses in four queries rather than four
 * per course — the N+1 that turns a 25-row page into 100+ round trips.
 */
async function loadChildren(ids: string[]): Promise<Map<string, Children>> {
  const map = new Map<string, Children>()
  if (ids.length === 0) return map

  for (const id of ids) {
    map.set(id, emptyChildren())
  }
  const placeholders = ids.map(() => '?').join(',')

  const syllabus = await query<Row>(
    `SELECT id, course_id, title, hours, topics, body, outcomes, tools, project,
            media_id, from_plan, position
       FROM course_syllabus WHERE course_id IN (${placeholders}) ORDER BY position`,
    ids,
  )
  for (const row of syllabus) {
    map.get(row.course_id as string)?.syllabus.push({
      id: row.id,
      title: row.title,
      hours: row.hours ?? undefined,
      topics: (row.topics as string[] | null) ?? [],
      body: row.body ?? undefined,
      outcomes: (row.outcomes as string[] | null) ?? [],
      tools: (row.tools as string[] | null) ?? [],
      project: row.project ?? undefined,
      mediaId: row.media_id ?? undefined,
      // 1-based for the editor; null means every plan reaches it.
      fromPlan: row.from_plan === null ? undefined : Number(row.from_plan),
    })
  }

  const highlights = await query<Row>(
    `SELECT course_id, value FROM course_highlights
      WHERE course_id IN (${placeholders}) ORDER BY position`,
    ids,
  )
  for (const row of highlights) {
    map.get(row.course_id as string)?.highlights.push(row.value as string)
  }

  /**
   * Loads one ordered child table into `map`.
   *
   * Seven of these differ only in the table, the columns and the row shape, and
   * writing each out longhand is seven chances to forget the ORDER BY — which
   * is the bug that would show as an editor's arrangement silently not sticking.
   */
  async function loadInto(
    table: string,
    columns: string,
    key: keyof Children,
    toItem: (row: Row) => unknown,
    extraWhere = '',
  ) {
    const rows = await query<Row>(
      `SELECT course_id, ${columns} FROM ${table}
        WHERE course_id IN (${placeholders})${extraWhere} ORDER BY position`,
      ids,
    )
    for (const row of rows) {
      ;(map.get(row.course_id as string)?.[key] as unknown[])?.push(toItem(row))
    }
  }

  const text = (v: unknown) => (v === null || v === undefined ? undefined : (v as string))

  await loadInto('course_audience', 'id, title, body, icon, position', 'audience', (r) => ({
    id: r.id,
    title: r.title,
    body: r.body,
    icon: text(r.icon),
  }))

  await loadInto(
    'course_benefits',
    'id, placement, title, body, icon, position',
    'benefits',
    (r) => ({
      id: r.id,
      placement: r.placement,
      title: r.title,
      body: text(r.body),
      icon: text(r.icon),
    }),
  )

  await loadInto(
    'course_careers',
    'id, role, body, salary_start, salary_senior, market, salary_note, icon, position',
    'careers',
    (r) => ({
      id: r.id,
      role: r.role,
      body: text(r.body),
      salaryStart: text(r.salary_start),
      salarySenior: text(r.salary_senior),
      market: text(r.market),
      salaryNote: text(r.salary_note),
      icon: text(r.icon),
    }),
  )

  await loadInto(
    'course_projects',
    'id, title, body, tags, difficulty, media_id, demo_url, repo_url, video_url, position',
    'projects',
    (r) => ({
      id: r.id,
      title: r.title,
      body: r.body,
      tags: (r.tags as string[] | null) ?? [],
      difficulty: text(r.difficulty),
      demoUrl: text(r.demo_url),
      repoUrl: text(r.repo_url),
      videoUrl: text(r.video_url),
      mediaId: text(r.media_id),
    }),
  )

  await loadInto('course_points', 'id, kind, title, body, icon, position', 'points', (r) => ({
    id: r.id,
    kind: r.kind,
    title: r.title,
    body: text(r.body),
    icon: text(r.icon),
  }))

  await loadInto(
    'course_comparison',
    'id, feature, ours, theirs, position',
    'comparison',
    (r) => ({ id: r.id, feature: r.feature, ours: r.ours, theirs: r.theirs }),
  )

  await loadInto(
    'course_plans',
    'id, label, months, duration, summary, range_label, badge, popular, position',
    'plans',
    (r) => ({
      id: r.id,
      label: r.label,
      months: r.months === null ? undefined : Number(r.months),
      duration: text(r.duration),
      summary: text(r.summary),
      rangeLabel: text(r.range_label),
      badge: text(r.badge),
      popular: Boolean(r.popular),
    }),
  )

  // The link tables carry only ids — the CMS resolves them against the FAQ
  // and Review lists it already loads, and the public endpoint joins them.
  for (const [table, column, key] of [
    ['course_faqs', 'faq_id', 'faqIds'],
    ['course_reviews', 'review_id', 'reviewIds'],
    ['course_related', 'related_id', 'relatedIds'],
  ] as const) {
    const rows = await query<Row>(
      `SELECT course_id, ${column} AS ref FROM ${table}
        WHERE course_id IN (${placeholders}) ORDER BY position`,
      ids,
    )
    for (const row of rows) {
      ;(map.get(row.course_id as string)?.[key] as string[])?.push(row.ref as string)
    }
  }


  /*
    The files behind the `media_id`s, in one query.

    Projects, syllabus modules and tools have each carried a `media_id` since
    they were first modelled, but only the id — which is enough to store and
    useless to draw. Without the address the CMS cannot show a preview and the
    website cannot render the picture, which is why the column has sat unused.

    Attached here rather than joined inside `loadInto`: that helper is shared by
    seven tables and only three of them have media, so a join would complicate
    all seven to serve three. `mediaId` is left exactly as it was — `media` is
    added beside it, so nothing that reads the old field changes.
  */
  const withMedia = [...map.values()].flatMap((children) => [
    ...(children.projects as { mediaId?: string }[]),
    ...(children.syllabus as { mediaId?: string }[]),
  ])

  const mediaIds = [...new Set(withMedia.map((item) => item.mediaId).filter(Boolean))] as string[]

  if (mediaIds.length > 0) {
    const files = await query<Row>(
      `SELECT id, url, alt, width, height FROM media
        WHERE id IN (${mediaIds.map(() => '?').join(',')})`,
      mediaIds,
    )
    const byId = new Map(files.map((row) => [row.id as string, row]))

    for (const item of withMedia) {
      const file = item.mediaId ? byId.get(item.mediaId) : undefined
      if (!file) continue
      ;(item as { media?: unknown }).media = {
        id: file.id,
        url: file.url,
        alt: file.alt ?? '',
        width: file.width ?? undefined,
        height: file.height ?? undefined,
      }
    }
  }

  return map
}

const SELECT_COURSE = `
  SELECT c.*, m.url AS thumbnail_url, m.alt AS thumbnail_alt,
         cat.name AS category_name, cat.slug AS category_slug
    FROM courses c
    LEFT JOIN media m ON m.id = c.thumbnail_id
    LEFT JOIN categories cat ON cat.id = c.category_id
`

export async function list(params: ListParams): Promise<ListResult<unknown>> {
  const { sql: filterSql, params: filterParams } = buildFilters(params.filters, FILTERABLE)
  const { column, dir } = resolveSort(params.sort, SORTABLE, {
    column: 'c.updated_at',
    dir: 'desc',
  })

  // FULLTEXT where a search term is given, so this keeps using an index as the
  // table grows. LIKE '%term%' cannot.
  const searchSql = params.search ? ' AND MATCH(c.title, c.short_description) AGAINST (? IN NATURAL LANGUAGE MODE)' : ''
  const searchParams = params.search ? [params.search] : []
  const where = `WHERE 1=1${filterSql}${searchSql}`
  const whereParams = [...filterParams, ...searchParams]

  const totalRow = await queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total FROM courses c ${where}`,
    whereParams,
  )
  const total = Number(totalRow?.total ?? 0)

  const offset = (params.page - 1) * params.pageSize
  const rows = await query<Row>(
    `${SELECT_COURSE} ${where} ORDER BY ${column} ${dir} LIMIT ? OFFSET ?`,
    [...whereParams, params.pageSize, offset],
  )

  const children = await loadChildren(rows.map((row) => row.id as string))

  return {
    items: rows.map((row) => toCourse(row, children.get(row.id as string) ?? EMPTY)),
    total,
    page: params.page,
    pageSize: params.pageSize,
  }
}

export async function get(id: string): Promise<unknown> {
  const row = await queryOne<Row>(`${SELECT_COURSE} WHERE c.id = ? LIMIT 1`, [id])
  if (!row) throw notFound('Course')

  const children = await loadChildren([id])
  return toCourse(row, children.get(id) ?? EMPTY)
}

/**
 * Slugs become public URLs, so a duplicate would shadow an existing page.
 *
 * Scoped to the segment, because that is what the URL is scoped to:
 * /courses/cybersecurity and /after-12th-courses/cybersecurity are two
 * different pages and may both exist. Checking the slug alone rejected the
 * second one for clashing with a page it could never shadow.
 */
async function assertSlugFree(
  segment: string,
  slug: string,
  exceptId?: string,
): Promise<void> {
  const clash = await queryOne<{ id: string }>(
    `SELECT id FROM courses WHERE segment = ? AND slug = ?${exceptId ? ' AND id <> ?' : ''} LIMIT 1`,
    exceptId ? [segment, slug, exceptId] : [segment, slug],
  )
  if (clash) {
    throw unprocessable({ slug: 'Another course in this section already uses this slug.' })
  }
}

async function writeChildren(
  connection: PoolConnection,
  courseId: string,
  input: CourseInput,
): Promise<void> {
  // Replace wholesale rather than diffing — the payload is the full desired
  // state, and positions must end up contiguous.
  await connection.execute<ResultSetHeader>('DELETE FROM course_syllabus   WHERE course_id = ?', [courseId])
  await connection.execute<ResultSetHeader>('DELETE FROM course_highlights WHERE course_id = ?', [courseId])
  for (const table of [
    'course_audience',
    'course_benefits',
    'course_careers',
    'course_projects',
    'course_points',
    'course_comparison',
    'course_plans',
    'course_faqs',
    'course_reviews',
    'course_related',
  ]) {
    await connection.execute<ResultSetHeader>(`DELETE FROM ${table} WHERE course_id = ?`, [courseId])
  }

  for (const [index, module] of input.syllabus.entries()) {
    await connection.execute<ResultSetHeader>(
      `INSERT INTO course_syllabus
         (id, course_id, title, hours, topics, body, outcomes, tools, project,
          media_id, from_plan, position)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        randomUUID(),
        courseId,
        module.title,
        module.hours ?? null,
        JSON.stringify(module.topics),
        module.body || null,
        JSON.stringify(module.outcomes ?? []),
        JSON.stringify(module.tools ?? []),
        module.project || null,
        module.mediaId || null,
        module.fromPlan ?? null,
        index,
      ],
    )
  }

  for (const [index, value] of input.highlights.entries()) {
    await connection.execute<ResultSetHeader>(
      'INSERT INTO course_highlights (course_id, value, position) VALUES (?, ?, ?)',
      [courseId, value, index],
    )
  }


  /**
   * Writes one ordered child list.
   *
   * `position` comes from the array index, so the order the editor arranged is
   * the order stored — there is no separate sort field for them to disagree
   * with.
   */
  async function insertAll<T>(
    table: string,
    columns: string[],
    rows: T[],
    // Concrete rather than unknown[]: mysql2's execute() overloads reject an
    // unknown[] of parameters, and the failure surfaces as an unrelated-looking
    // "not assignable to QueryOptions" on the SQL string.
    values: (row: T, index: number) => (string | number | null)[],
  ) {
    if (rows.length === 0) return
    const cols = ['id', 'course_id', ...columns, 'position'].join(', ')
    const marks = new Array(columns.length + 3).fill('?').join(', ')
    for (const [index, row] of rows.entries()) {
      await connection.execute<ResultSetHeader>(
        `INSERT INTO ${table} (${cols}) VALUES (${marks})`,
        [randomUUID(), courseId, ...values(row, index), index],
      )
    }
  }

  for (const [table, column, values] of [
    ['course_faqs', 'faq_id', input.faqIds],
    ['course_reviews', 'review_id', input.reviewIds],
    ['course_related', 'related_id', input.relatedIds],
  ] as const) {
    for (const [index, ref] of values.entries()) {
      // A course relating to itself would render its own card in "related
      // courses" — harmless but plainly wrong, and easy to click by accident.
      if (table === 'course_related' && ref === courseId) continue
      await connection.execute<ResultSetHeader>(
        `INSERT IGNORE INTO ${table} (course_id, ${column}, position) VALUES (?, ?, ?)`,
        [courseId, ref, index],
      )
    }
  }

  await insertAll(
    'course_plans',
    ['label', 'months', 'duration', 'summary', 'range_label', 'badge', 'popular'],
    input.plans,
    (p) => [
      p.label,
      p.months ?? null,
      p.duration || null,
      p.summary || null,
      p.rangeLabel || null,
      p.badge || null,
      p.popular ? 1 : 0,
    ],
  )

  await insertAll('course_audience', ['title', 'body', 'icon'], input.audience, (a) => [
    a.title,
    a.body,
    a.icon || null,
  ])

  await insertAll(
    'course_benefits',
    ['placement', 'title', 'body', 'icon'],
    input.benefits,
    (b) => [b.placement, b.title, b.body || null, b.icon || null],
  )

  await insertAll(
    'course_careers',
    ['role', 'body', 'salary_start', 'salary_senior', 'market', 'salary_note', 'icon'],
    input.careerRoles,
    (c) => [
      c.role,
      c.body || null,
      c.salaryStart || null,
      c.salarySenior || null,
      c.market || null,
      c.salaryNote || null,
      c.icon || null,
    ],
  )

  await insertAll(
    'course_projects',
    ['title', 'body', 'tags', 'difficulty', 'media_id', 'demo_url', 'repo_url', 'video_url'],
    input.projects,
    (p) => [
      p.title,
      p.body,
      JSON.stringify(p.tags ?? []),
      p.difficulty || null,
      p.mediaId || null,
      p.demoUrl || null,
      p.repoUrl || null,
      p.videoUrl || null,
    ],
  )

  // Workflow steps and why-us points share a table and differ by `kind`.
  await insertAll(
    'course_points',
    ['kind', 'title', 'body', 'icon'],
    [
      ...input.workflow.map((w) => ({ ...w, kind: 'workflow' as const })),
      ...input.whyPoints.map((w) => ({ ...w, kind: 'why-techcadd' as const })),
    ],
    (p) => [p.kind, p.title, p.body || null, p.icon || null],
  )

  await insertAll(
    'course_comparison',
    ['feature', 'ours', 'theirs'],
    input.comparisonRows,
    (r) => [r.feature, r.ours, r.theirs],
  )

}

const COLUMNS = `title, slug, segment, category_id, short_description,
  careers, tools, duration,
  level, mode, thumbnail_id,
  icon, level_label, fee_amount, fee_installments, seats, next_batch,
  weekly_hours, rating_value, rating_count, modes, languages, batches,
  eligibility, certification, status,
  overview, video_url, video_title,
  eyebrow, badge, h1, intro,
  cta_primary_text, cta_primary_type, cta_primary_url,
  cta_secondary_text, cta_secondary_type, cta_secondary_url,
  meta_title, meta_description, meta_keywords, og_image_id, canonical_url,
  og_title, og_description, twitter_title, twitter_description,
  robots_index, in_sitemap, faq_schema, scheduled_for`

function columnValues(input: CourseInput): unknown[] {
  return [
    input.title,
    input.slug,
    input.segment,
    input.categoryId || null,
    input.shortDescription,
    JSON.stringify(input.careers ?? []),
    JSON.stringify(input.tools ?? []),
    input.duration || null,
    input.level || null,
    input.mode || null,
    input.thumbnail?.id ?? null,
    input.icon || null,
    input.levelLabel || null,
    input.feeAmount ?? null,
    input.feeInstallments || null,
    input.seats ?? null,
    input.nextBatch || null,
    input.weeklyHours || null,
    input.ratingValue ?? null,
    input.ratingCount ?? null,
    JSON.stringify(input.modes ?? []),
    JSON.stringify(input.languages ?? []),
    JSON.stringify(input.batches ?? []),
    input.eligibility ?? null,
    input.certification ?? null,
    input.status,
    input.overview || null,
    input.videoUrl || null,
    input.videoTitle || null,
    input.eyebrow || null,
    input.badge || null,
    input.h1 || null,
    input.intro || null,
    // A CTA with no label is not a CTA — storing the type without the text
    // would render a button with an empty face.
    input.ctaPrimary?.text || null,
    input.ctaPrimary?.text ? input.ctaPrimary.type : null,
    input.ctaPrimary?.url || null,
    input.ctaSecondary?.text || null,
    input.ctaSecondary?.text ? input.ctaSecondary.type : null,
    input.ctaSecondary?.url || null,
    input.seo.metaTitle ?? null,
    input.seo.metaDescription ?? null,
    JSON.stringify(input.seo.keywords ?? []),
    input.seo.ogImage?.id ?? null,
    input.seo.canonicalUrl ?? null,
    input.seo.ogTitle || null,
    input.seo.ogDescription || null,
    input.seo.twitterTitle || null,
    input.seo.twitterDescription || null,
    input.seo.robotsIndex === false ? 0 : 1,
    input.seo.inSitemap === false ? 0 : 1,
    input.seo.faqSchema === false ? 0 : 1,
    // Only meaningful while the course is waiting; clearing it with the status
    // stops a stale date reappearing if it is scheduled again later.
    input.status === 'scheduled' && input.scheduledFor ? new Date(input.scheduledFor) : null,
  ]
}

export async function create(input: CourseInput): Promise<unknown> {
  await assertSlugFree(input.segment, input.slug)

  const id = randomUUID()
  await transaction(async (connection) => {
    const placeholders = COLUMNS.split(',').length
    await connection.execute<ResultSetHeader>(
      `INSERT INTO courses (id, ${COLUMNS}, created_at, updated_at)
       VALUES (?, ${Array(placeholders).fill('?').join(', ')}, NOW(3), NOW(3))`,
      [id, ...columnValues(input)] as ExecuteValues,
    )
    await writeChildren(connection, id, input)
  })

  return get(id)
}

export async function update(id: string, input: CourseInput): Promise<unknown> {
  const existing = await queryOne<{ id: string }>('SELECT id FROM courses WHERE id = ? LIMIT 1', [id])
  if (!existing) throw notFound('Course')

  await assertSlugFree(input.segment, input.slug, id)

  await transaction(async (connection) => {
    const assignments = COLUMNS.split(',')
      .map((column) => `${column.trim()} = ?`)
      .join(', ')

    await connection.execute<ResultSetHeader>(
      `UPDATE courses SET ${assignments}, updated_at = NOW(3) WHERE id = ?`,
      [...columnValues(input), id] as ExecuteValues,
    )
    await writeChildren(connection, id, input)
  })

  return get(id)
}

export async function remove(ids: string[]): Promise<void> {
  if (ids.length === 0) return
  // Child rows go with them via ON DELETE CASCADE.
  await query(`DELETE FROM courses WHERE id IN (${ids.map(() => '?').join(',')})`, ids)
}
