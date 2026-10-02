import { query, queryOne, type Row } from '../../db/pool.js'

/**
 * Reads over the activity log.
 *
 * Every figure here is counted in SQL from `activity_log`. Nothing is cached,
 * accumulated in a counter column or totalled in the browser — a contribution
 * count that drifts from the history it claims to summarise is worse than no
 * count, and a counter column is exactly how that drift happens.
 */

export interface ActivityFilters {
  userId?: string
  entityType?: string
  action?: string
  from?: string
  to?: string
}

/**
 * The WHERE for a filter set, as SQL and its parameters.
 *
 * Built here rather than inline so the log, the totals and the per-person
 * breakdown cannot disagree about what "this month" means.
 */
function where(filters: ActivityFilters): { sql: string; params: unknown[] } {
  const clauses: string[] = []
  const params: unknown[] = []

  if (filters.userId) {
    clauses.push('user_id = ?')
    params.push(filters.userId)
  }
  if (filters.entityType) {
    clauses.push('entity_type = ?')
    params.push(filters.entityType)
  }
  if (filters.action) {
    clauses.push('action = ?')
    params.push(filters.action)
  }
  if (filters.from) {
    clauses.push('created_at >= ?')
    params.push(filters.from)
  }
  if (filters.to) {
    // Inclusive of the whole end day: a range ending "today" that stopped at
    // midnight would silently omit everything done today.
    clauses.push('created_at < DATE_ADD(?, INTERVAL 1 DAY)')
    params.push(filters.to)
  }

  return { sql: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', params }
}

export interface ActivityEntry {
  id: string
  userId: string | null
  userName: string
  action: string
  entityType: string
  entityId: string | null
  entityLabel: string | null
  metadata: unknown
  createdAt: string
}

export async function list(
  filters: ActivityFilters,
  page: number,
  pageSize: number,
): Promise<{ items: ActivityEntry[]; total: number }> {
  const { sql, params } = where(filters)

  const totalRow = await queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total FROM activity_log ${sql}`,
    params,
  )

  const rows = await query<Row>(
    `SELECT id, user_id, user_name, action, entity_type, entity_id, entity_label,
            metadata, created_at
       FROM activity_log ${sql}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?`,
    [...params, pageSize, (page - 1) * pageSize],
  )

  return {
    total: Number(totalRow?.total ?? 0),
    items: rows.map((row) => ({
      id: row.id as string,
      userId: (row.user_id as string | null) ?? null,
      userName: row.user_name as string,
      action: row.action as string,
      entityType: row.entity_type as string,
      entityId: (row.entity_id as string | null) ?? null,
      entityLabel: (row.entity_label as string | null) ?? null,
      metadata: row.metadata ?? null,
      createdAt: row.created_at as string,
    })),
  }
}

/**
 * Per-person totals, and a column per content type.
 *
 * One query with conditional sums rather than one per person: the alternative
 * is a query per row of a table that grows with the team, and it would still
 * have to be reconciled afterwards.
 */
export async function byPerson(filters: ActivityFilters) {
  const { sql, params } = where(filters)

  const rows = await query<Row>(
    `SELECT user_id, user_name,
            SUM(action IN ('created','published'))                    AS added,
            SUM(action = 'updated')                                   AS updated,
            SUM(action = 'published')                                 AS published,
            SUM(action = 'deleted')                                   AS deleted,
            SUM(entity_type = 'blogs'        AND action <> 'deleted')  AS blogs,
            SUM(entity_type = 'courses'      AND action <> 'deleted')  AS courses,
            SUM(entity_type = 'faqs'         AND action <> 'deleted')  AS faqs,
            SUM(entity_type = 'reviews'      AND action <> 'deleted')  AS reviews,
            SUM(entity_type = 'pages'        AND action <> 'deleted')  AS pages,
            SUM(entity_type = 'testimonials' AND action <> 'deleted')  AS testimonials,
            COUNT(*)                                                   AS actions,
            MIN(created_at)                                            AS first_at,
            MAX(created_at)                                            AS last_at
       FROM activity_log ${sql}
      GROUP BY user_id, user_name
      ORDER BY added DESC, actions DESC`,
    params,
  )

  const people = rows.map((row) => ({
    userId: (row.user_id as string | null) ?? null,
    userName: row.user_name as string,
    added: Number(row.added ?? 0),
    updated: Number(row.updated ?? 0),
    published: Number(row.published ?? 0),
    deleted: Number(row.deleted ?? 0),
    blogs: Number(row.blogs ?? 0),
    courses: Number(row.courses ?? 0),
    faqs: Number(row.faqs ?? 0),
    reviews: Number(row.reviews ?? 0),
    pages: Number(row.pages ?? 0),
    testimonials: Number(row.testimonials ?? 0),
    actions: Number(row.actions ?? 0),
    firstAt: (row.first_at as string | null) ?? null,
    lastAt: (row.last_at as string | null) ?? null,
  }))

  // Share of what was *added*, not of every action — otherwise the person who
  // edits most often outranks the person who wrote the most.
  const totalAdded = people.reduce((sum, person) => sum + person.added, 0)

  return people.map((person) => ({
    ...person,
    share: totalAdded > 0 ? Math.round((person.added / totalAdded) * 1000) / 10 : 0,
  }))
}

/** Totals across the team, and what exists right now. */
export async function summary(filters: ActivityFilters) {
  const { sql, params } = where(filters)

  const totals = await queryOne<Row>(
    `SELECT COUNT(DISTINCT user_id)                 AS people,
            SUM(action IN ('created','published'))  AS added,
            SUM(action = 'updated')                 AS updated,
            SUM(action = 'published')               AS published,
            SUM(action = 'deleted')                 AS deleted
       FROM activity_log ${sql}`,
    params,
  )

  /**
   * What is live right now, counted from the content itself.
   *
   * Not from the log: the log says what happened, and a piece created and then
   * deleted leaves two rows and no content. "How much do we have" can only be
   * answered by the tables that hold it.
   */
  const live = await queryOne<Row>(
    `SELECT
       (SELECT COUNT(*) FROM blogs        WHERE status = 'published') AS blogs,
       (SELECT COUNT(*) FROM courses      WHERE status = 'published') AS courses,
       (SELECT COUNT(*) FROM faqs         WHERE status = 'published') AS faqs,
       (SELECT COUNT(*) FROM reviews)                                 AS reviews,
       (SELECT COUNT(*) FROM pages        WHERE status = 'published') AS pages,
       (SELECT COUNT(*) FROM testimonials WHERE status = 'published') AS testimonials`,
  )

  return {
    people: Number(totals?.people ?? 0),
    added: Number(totals?.added ?? 0),
    updated: Number(totals?.updated ?? 0),
    published: Number(totals?.published ?? 0),
    deleted: Number(totals?.deleted ?? 0),
    live: {
      blogs: Number(live?.blogs ?? 0),
      courses: Number(live?.courses ?? 0),
      faqs: Number(live?.faqs ?? 0),
      reviews: Number(live?.reviews ?? 0),
      pages: Number(live?.pages ?? 0),
      testimonials: Number(live?.testimonials ?? 0),
    },
  }
}

/** Contributions per content type, for the breakdown chart. */
export async function byType(filters: ActivityFilters) {
  const { sql, params } = where(filters)
  const rows = await query<Row>(
    `SELECT entity_type,
            SUM(action IN ('created','published')) AS added,
            SUM(action = 'updated')                AS updated,
            COUNT(*)                               AS actions
       FROM activity_log ${sql}
      GROUP BY entity_type
      ORDER BY added DESC`,
    params,
  )
  return rows.map((row) => ({
    entityType: row.entity_type as string,
    added: Number(row.added ?? 0),
    updated: Number(row.updated ?? 0),
    actions: Number(row.actions ?? 0),
  }))
}

/** Content added per day, for the trend chart. */
export async function trend(filters: ActivityFilters) {
  const { sql, params } = where(filters)
  const rows = await query<Row>(
    `SELECT DATE(created_at) AS day,
            SUM(action IN ('created','published')) AS added,
            SUM(action = 'updated')                AS updated
       FROM activity_log ${sql}
      GROUP BY DATE(created_at)
      ORDER BY day`,
    params,
  )
  return rows.map((row) => ({
    date: String(row.day).slice(0, 10),
    added: Number(row.added ?? 0),
    updated: Number(row.updated ?? 0),
  }))
}

/** Who last touched one record, for its edit screen. */
export async function ownership(entityType: string, entityId: string) {
  const row = await queryOne<Row>(
    `SELECT
       (SELECT user_name FROM activity_log
         WHERE entity_type = ? AND entity_id = ? AND action IN ('created','published')
         ORDER BY created_at ASC LIMIT 1)  AS created_by,
       (SELECT created_at FROM activity_log
         WHERE entity_type = ? AND entity_id = ? AND action IN ('created','published')
         ORDER BY created_at ASC LIMIT 1)  AS created_at,
       (SELECT user_name FROM activity_log
         WHERE entity_type = ? AND entity_id = ?
         ORDER BY created_at DESC LIMIT 1) AS updated_by,
       (SELECT created_at FROM activity_log
         WHERE entity_type = ? AND entity_id = ?
         ORDER BY created_at DESC LIMIT 1) AS updated_at`,
    [entityType, entityId, entityType, entityId, entityType, entityId, entityType, entityId],
  )

  return {
    createdBy: (row?.created_by as string | null) ?? null,
    createdAt: (row?.created_at as string | null) ?? null,
    updatedBy: (row?.updated_by as string | null) ?? null,
    updatedAt: (row?.updated_at as string | null) ?? null,
  }
}
