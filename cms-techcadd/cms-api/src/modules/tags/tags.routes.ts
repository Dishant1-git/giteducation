import { Router } from 'express'
import { z } from 'zod'

import { query, type Row } from '../../db/pool.js'
import { asyncHandler } from '../../http/errors.js'
import { requireAuth } from '../../middleware/auth.js'

export const tagsRouter = Router()

tagsRouter.use(requireAuth)

const searchSchema = z.object({ q: z.string().max(60).optional() })

/**
 * Every tag, with how many posts carry it.
 *
 * Read-only, and there is no create endpoint on purpose: a tag comes into
 * existence by being typed on a post. Making an editor go somewhere else to
 * register one first, then come back and apply it, is two steps to express one
 * intention — and it leaves tags nobody used lying about.
 *
 * The count is what makes the suggestion list useful: "Careers (4)" tells an
 * editor this is the tag the team already uses, which is how a suggestion list
 * prevents near-duplicates rather than merely offering them.
 */
tagsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const { q } = searchSchema.parse(req.query)

    const rows = await query<Row>(
      `SELECT t.id, t.name, t.slug, COUNT(bt.blog_id) AS uses
         FROM tags t
         LEFT JOIN blog_tags bt ON bt.tag_id = t.id
        ${q ? 'WHERE t.name LIKE ?' : ''}
        GROUP BY t.id, t.name, t.slug
        ORDER BY uses DESC, t.name ASC`,
      q ? [`%${q}%`] : [],
    )

    res.json({
      items: rows.map((row) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        uses: Number(row.uses ?? 0),
      })),
      total: rows.length,
    })
  }),
)
