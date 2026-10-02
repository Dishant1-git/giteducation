import { randomUUID } from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'

import { execute } from '../db/pool.js'

/**
 * Records who changed what, for every module, without any module knowing.
 *
 * Written as one middleware rather than a call inside each route on purpose.
 * Fifteen modules each remembering to log is fifteen chances to forget, and
 * the one that forgets is invisible — the contribution figures are simply
 * quietly wrong, and nothing fails. A recorder that sees every request cannot
 * miss one.
 *
 * It records after the fact, from the response: a 4xx never happened as far as
 * the history is concerned, and the response body is where the id of a
 * just-created record lives.
 */

/**
 * URL segment to table, and the whitelist that makes the UPDATE below safe.
 *
 * `entity_type` reaches SQL as a table name, which cannot be parameterised, so
 * it is never taken from the request — only ever from this map's values.
 */
const TABLES: Record<string, string> = {
  blogs: 'blogs',
  courses: 'courses',
  events: 'events',
  faqs: 'faqs',
  reviews: 'reviews',
  pages: 'pages',
  testimonials: 'testimonials',
  gallery: 'gallery_albums',
  categories: 'categories',
  media: 'media',
  redirects: 'redirects',
}

/** Modules whose writes are not content changes, and would only add noise. */
const IGNORED = new Set(['auth', 'preview', 'public', 'health', 'dashboard', 'search'])

type Action =
  | 'created'
  | 'updated'
  | 'published'
  | 'unpublished'
  | 'deleted'
  | 'approved'
  | 'hidden'

/** The first thing in a payload that reads like a name, for the log's label. */
function labelOf(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null
  const record = body as Record<string, unknown>
  for (const key of ['title', 'question', 'name', 'studentName', 'authorName', 'quote', 'slug']) {
    const value = record[key]
    if (typeof value === 'string' && value.trim()) return value.slice(0, 200)
  }
  return null
}

/**
 * What happened, in the words the dashboard counts by.
 *
 * A status change is reported as publishing rather than as an ordinary edit,
 * because "who published this" is a question people actually ask and an
 * `updated` row cannot answer it.
 */
function actionFor(method: string, sent: unknown, requested: unknown): Action {
  const status = (requested as { status?: unknown } | null)?.status

  if (method === 'DELETE') return 'deleted'
  if (method === 'POST') {
    return status === 'published' ? 'published' : 'created'
  }

  if (status === 'published') return 'published'
  if (status === 'draft' || status === 'review') {
    // Only a demotion counts as unpublishing; a draft saved again is an edit.
    const was = (sent as { status?: unknown } | null)?.status
    return was === 'published' ? 'unpublished' : 'updated'
  }
  return 'updated'
}

export function auditTrail(req: Request, res: Response, next: NextFunction): void {
  const method = req.method
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return next()

  // /api/<module>/<id?>
  const segments = req.originalUrl.split('?')[0]!.split('/').filter(Boolean)
  const module = segments[0] === 'api' ? segments[1] : segments[0]
  if (!module || IGNORED.has(module)) return next()

  const requestBody = req.body as unknown

  // The response body carries the id of anything just created, so it is read
  // rather than guessed from the URL.
  let sent: unknown
  const json = res.json.bind(res)
  res.json = (body: unknown) => {
    sent = body
    return json(body)
  }

  res.on('finish', () => {
    if (res.statusCode < 200 || res.statusCode >= 300) return

    const user = req.user
    if (!user) return

    const action = actionFor(method, sent, requestBody)
    const table = TABLES[module]

    /**
     * A bulk delete sends a list of ids and no body, so it is recorded once
     * with the count in metadata rather than pretending to be one deletion.
     */
    const ids = (requestBody as { ids?: unknown } | null)?.ids
    const bulk = Array.isArray(ids) ? (ids as string[]) : null

    const fromUrl = segments[2] && segments[2] !== 'bulk' ? segments[2] : null
    const entityId =
      (sent as { id?: unknown } | null)?.id ?? (bulk?.length === 1 ? bulk[0] : fromUrl)

    const label = labelOf(sent) ?? labelOf(requestBody)

    // Fire and forget. A history that can fail a save is worse than a history
    // with a gap in it, so a failure here is logged and swallowed.
    void (async () => {
      try {
        await execute(
          `INSERT INTO activity_log
             (id, user_id, user_name, action, entity_type, entity_id, entity_label, metadata, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(3))`,
          [
            randomUUID(),
            user.userId,
            user.name,
            action,
            module,
            typeof entityId === 'string' ? entityId : null,
            label,
            bulk && bulk.length > 1 ? JSON.stringify({ count: bulk.length, ids: bulk }) : null,
          ],
        )

        // And stamp the record itself, so the edit screen can say who without
        // scanning the log. Only for tables that carry the pair.
        if (table && typeof entityId === 'string' && action !== 'deleted') {
          const columns =
            method === 'POST' ? 'created_by = ?, updated_by = ?' : 'updated_by = ?'
          const values = method === 'POST' ? [user.userId, user.userId] : [user.userId]
          await execute(`UPDATE ${table} SET ${columns} WHERE id = ?`, [...values, entityId])
        }
      } catch (error) {
        console.error('[audit] could not record an action:', error)
      }
    })()
  })

  next()
}
