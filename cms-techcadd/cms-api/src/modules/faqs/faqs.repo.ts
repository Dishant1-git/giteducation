import { randomUUID } from 'node:crypto'

import { execute, query, queryOne, type Row } from '../../db/pool.js'
import { notFound, unprocessable } from '../../http/errors.js'
import {
  buildFilters,
  resolveSort,
  type ListParams,
  type ListResult,
} from '../../http/listParams.js'
import type { FaqInput, FaqPatch } from './faqs.schema.js'

const SORTABLE: Record<string, string> = {
  question: 'f.question',
  category: 'c.name',
  order: 'f.sort_order',
  status: 'f.status',
  createdAt: 'f.created_at',
  updatedAt: 'f.updated_at',
}

const FILTERABLE: Record<string, string> = {
  status: 'f.status',
  category: 'c.name',
  featured: 'f.featured',
  createdAt: 'f.created_at',
  updatedAt: 'f.updated_at',
}

function toFaq(row: Row): unknown {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    categoryId: row.category_id,
    category: row.category_name,
    order: Number(row.sort_order),
    featured: Boolean(row.featured),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function list(params: ListParams): Promise<ListResult<unknown>> {
  const { sql: filterSql, params: filterParams } = buildFilters(params.filters, FILTERABLE)
  // Grouped by category, then by hand-set order — the shape the FAQ page renders.
  const { column, dir } = resolveSort(params.sort, SORTABLE, { column: 'f.sort_order', dir: 'asc' })

  const searchSql = params.search ? ' AND (f.question LIKE ? OR f.answer LIKE ?)' : ''
  const like = `%${params.search ?? ''}%`
  const searchParams = params.search ? [like, like] : []

  const where = `WHERE 1=1${filterSql}${searchSql}`
  const whereParams = [...filterParams, ...searchParams]

  const totalRow = await queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total FROM faqs f ${where}`,
    whereParams,
  )

  const offset = (params.page - 1) * params.pageSize
  const rows = await query<Row>(
    `SELECT f.*, c.name AS category_name, c.slug AS category_slug
       FROM faqs f JOIN faq_categories c ON c.id = f.category_id
      ${where} ORDER BY c.sort_order ASC, ${column} ${dir} LIMIT ? OFFSET ?`,
    [...whereParams, params.pageSize, offset],
  )

  return {
    items: rows.map(toFaq),
    total: Number(totalRow?.total ?? 0),
    page: params.page,
    pageSize: params.pageSize,
  }
}

export async function get(id: string): Promise<unknown> {
  const row = await queryOne<Row>(
    `SELECT f.*, c.name AS category_name, c.slug AS category_slug
       FROM faqs f JOIN faq_categories c ON c.id = f.category_id
      WHERE f.id = ? LIMIT 1`,
    [id],
  )
  if (!row) throw notFound('Question')
  return toFaq(row)
}

/**
 * The category a question is filed under, by id or by name.
 *
 * Matching is by slug, so "Placements", "placements" and "Placement s" cannot
 * become three headings — the same rule that keeps blog tags from splitting.
 */
export async function resolveCategory(
  categoryId: string | undefined,
  categoryName: string | undefined,
): Promise<string> {
  if (categoryId) {
    const found = await queryOne<Row>('SELECT id FROM faq_categories WHERE id = ? LIMIT 1', [
      categoryId,
    ])
    if (found) return found.id as string
  }

  const name = categoryName?.trim()
  if (!name) throw unprocessable({ categoryId: 'Choose a category.' })

  const slug =
    name
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'general'

  const existing = await queryOne<Row>('SELECT id FROM faq_categories WHERE slug = ? LIMIT 1', [
    slug,
  ])
  if (existing) return existing.id as string

  const id = randomUUID()
  await execute(
    `INSERT INTO faq_categories (id, name, slug, sort_order, active, created_at, updated_at)
     VALUES (?, ?, ?, (SELECT COALESCE(MAX(o.sort_order), 0) + 1 FROM (SELECT sort_order FROM faq_categories) o), 1, NOW(3), NOW(3))`,
    [id, name.slice(0, 80), slug],
  )
  return id
}

export async function create(input: FaqInput): Promise<unknown> {
  const id = randomUUID()
  await execute(
    `INSERT INTO faqs (id, question, answer, category_id, sort_order, featured, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
    [
      id,
      input.question,
      input.answer,
      await resolveCategory(input.categoryId, input.categoryName),
      input.order,
      input.featured ? 1 : 0,
      input.status,
    ],
  )
  return get(id)
}

export async function update(id: string, patch: FaqPatch): Promise<unknown> {
  const existing = await queryOne<Row>('SELECT id FROM faqs WHERE id = ? LIMIT 1', [id])
  if (!existing) throw notFound('Question')

  const mapping: Record<string, string> = {
    question: 'question',
    answer: 'answer',
    order: 'sort_order',
    status: 'status',
  }

  const assignments: string[] = []
  const params: unknown[] = []

  /*
    The category is resolved rather than assigned.

    Handled outside the mapping above because an edit can name a category that
    does not exist yet — the same as creating one does — and a straight column
    assignment would write the name into a column that holds an id.
  */
  if (patch.categoryId !== undefined || patch.categoryName !== undefined) {
    assignments.push('category_id = ?')
    params.push(await resolveCategory(patch.categoryId, patch.categoryName))
  }

  for (const [key, column] of Object.entries(mapping)) {
    const value = patch[key as keyof FaqPatch]
    if (value === undefined) continue
    assignments.push(`${column} = ?`)
    params.push(value)
  }

  // `false` is a value, not an absence, so a boolean needs its own branch.
  if (patch.featured !== undefined) {
    assignments.push('featured = ?')
    params.push(patch.featured ? 1 : 0)
  }

  if (assignments.length > 0) {
    await execute(
      `UPDATE faqs SET ${assignments.join(', ')}, updated_at = NOW(3) WHERE id = ?`,
      [...params, id],
    )
  }

  return get(id)
}

export async function remove(ids: string[]): Promise<void> {
  if (ids.length === 0) return
  await query(`DELETE FROM faqs WHERE id IN (${ids.map(() => '?').join(',')})`, ids)
}

/** The distinct categories in use, so the form can offer them. */
export async function categories(): Promise<string[]> {
  const rows = await query<{ name: string }>(
    'SELECT name FROM faq_categories ORDER BY sort_order ASC, name ASC',
  )
  return rows.map((row) => row.name)
}
