import { randomUUID } from 'node:crypto'

import { execute, query, queryOne, type Row } from '../../db/pool.js'
import { badRequest, notFound, unprocessable } from '../../http/errors.js'
import type { FaqCategoryInput } from './faq_categories.schema.js'

function toCategory(row: Row): unknown {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? undefined,
    icon: row.icon ?? undefined,
    order: Number(row.sort_order ?? 0),
    active: Boolean(row.active),
    /** How many questions are filed here — the first thing an editor looks for. */
    faqCount: Number(row.faq_count ?? 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

const SELECT = `
  SELECT c.*, (SELECT COUNT(*) FROM faqs f WHERE f.category_id = c.id) AS faq_count
    FROM faq_categories c
`

/** Every category, in display order. Small and hand-ordered, so never paged. */
export async function list(): Promise<{ items: unknown[]; total: number }> {
  const rows = await query<Row>(`${SELECT} ORDER BY c.sort_order ASC, c.name ASC`)
  return { items: rows.map(toCategory), total: rows.length }
}

export async function get(id: string): Promise<unknown> {
  const row = await queryOne<Row>(`${SELECT} WHERE c.id = ? LIMIT 1`, [id])
  if (!row) throw notFound('FAQ category')
  return toCategory(row)
}

/**
 * Name and slug are both unique, and both are checked before the insert.
 *
 * The database enforces it either way, but a duplicate key surfaces as a
 * 500 with a driver message in it; this surfaces as the field that clashed.
 */
async function assertFree(input: FaqCategoryInput, exceptId?: string): Promise<void> {
  const clash = await queryOne<Row>(
    `SELECT name, slug FROM faq_categories
      WHERE (name = ? OR slug = ?)${exceptId ? ' AND id <> ?' : ''} LIMIT 1`,
    exceptId ? [input.name, input.slug, exceptId] : [input.name, input.slug],
  )
  if (!clash) return

  throw unprocessable(
    clash.name === input.name
      ? { name: 'A category with this name already exists.' }
      : { slug: 'A category with this address already exists.' },
  )
}

export async function create(input: FaqCategoryInput, userId: string): Promise<unknown> {
  await assertFree(input)

  const id = randomUUID()
  await execute(
    `INSERT INTO faq_categories
       (id, name, slug, description, icon, sort_order, active, created_by, updated_by, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
    [
      id,
      input.name,
      input.slug,
      input.description || null,
      input.icon || null,
      input.order,
      input.active ? 1 : 0,
      userId,
      userId,
    ],
  )
  return get(id)
}

export async function update(
  id: string,
  input: FaqCategoryInput,
  userId: string,
): Promise<unknown> {
  const existing = await queryOne<Row>('SELECT id FROM faq_categories WHERE id = ? LIMIT 1', [id])
  if (!existing) throw notFound('FAQ category')

  await assertFree(input, id)

  await execute(
    `UPDATE faq_categories
        SET name = ?, slug = ?, description = ?, icon = ?, sort_order = ?, active = ?,
            updated_by = ?, updated_at = NOW(3)
      WHERE id = ?`,
    [
      input.name,
      input.slug,
      input.description || null,
      input.icon || null,
      input.order,
      input.active ? 1 : 0,
      userId,
      id,
    ],
  )
  return get(id)
}

/**
 * Deleting a category needs somewhere for its questions to go.
 *
 * The foreign key is deliberately not ON DELETE CASCADE: removing a category
 * should never silently remove the answers filed under it. Either the caller
 * says where to move them, or the category has to be emptied first.
 */
export async function remove(ids: string[], moveTo?: string): Promise<void> {
  if (ids.length === 0) return

  const placeholders = ids.map(() => '?').join(',')
  const inUse = await queryOne<{ n: number }>(
    `SELECT COUNT(*) AS n FROM faqs WHERE category_id IN (${placeholders})`,
    ids,
  )

  if (Number(inUse?.n ?? 0) > 0) {
    if (!moveTo) {
      throw badRequest(
        'These categories still hold questions. Choose a category to move them to first.',
      )
    }
    if (ids.includes(moveTo)) {
      throw badRequest('Choose a category that is not being deleted.')
    }

    const target = await queryOne<Row>('SELECT id FROM faq_categories WHERE id = ? LIMIT 1', [
      moveTo,
    ])
    if (!target) throw badRequest('That category no longer exists.')

    await execute(
      `UPDATE faqs SET category_id = ? WHERE category_id IN (${placeholders})`,
      [moveTo, ...ids],
    )
  }

  await execute(`DELETE FROM faq_categories WHERE id IN (${placeholders})`, ids)
}

/** Applies a hand-arranged order in one pass. */
export async function reorder(ids: string[]): Promise<void> {
  for (const [index, id] of ids.entries()) {
    await execute('UPDATE faq_categories SET sort_order = ?, updated_at = NOW(3) WHERE id = ?', [
      index,
      id,
    ])
  }
}

/**
 * What the website reads: active categories, each with its published questions.
 *
 * Two queries rather than one per category, and assembled here — the page
 * renders categories with their questions inside, and making the site issue a
 * request per category to build that would be a round trip per tab.
 */
export async function publicTree() {
  const categories = await query<Row>(
    `SELECT id, name, slug, description, icon FROM faq_categories
      WHERE active = 1 ORDER BY sort_order ASC, name ASC`,
  )

  const faqs = await query<Row>(
    `SELECT id, category_id, question, answer, featured, sort_order
       FROM faqs WHERE status = 'published'
      ORDER BY sort_order ASC, question ASC`,
  )

  const byCategory = new Map<string, unknown[]>()
  for (const faq of faqs) {
    const list = byCategory.get(faq.category_id as string) ?? []
    list.push({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      featured: Boolean(faq.featured),
    })
    byCategory.set(faq.category_id as string, list)
  }

  return (
    categories
      .map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description ?? undefined,
        icon: category.icon ?? undefined,
        faqs: byCategory.get(category.id as string) ?? [],
      }))
      // An empty category is a tab that leads nowhere, so it is not offered.
      .filter((category) => category.faqs.length > 0)
  )
}
