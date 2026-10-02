import { randomUUID } from 'node:crypto'

import { execute, query, queryOne, type Row } from '../../db/pool.js'
import { notFound } from '../../http/errors.js'
import {
  buildFilters,
  resolveSort,
  type ListParams,
  type ListResult,
} from '../../http/listParams.js'
import type { AiKnowledgeInput, AiKnowledgePatch } from './ai_knowledge.schema.js'

const SORTABLE: Record<string, string> = {
  title: 'ak.title',
  category: 'ak.category',
  order: 'ak.sort_order',
  status: 'ak.status',
  createdAt: 'ak.created_at',
  updatedAt: 'ak.updated_at',
}

const FILTERABLE: Record<string, string> = {
  status: 'ak.status',
  category: 'ak.category',
  createdAt: 'ak.created_at',
  updatedAt: 'ak.updated_at',
}

function parseLinks(raw: unknown): string[] {
  if (!raw || typeof raw !== 'string') return []
  try { return JSON.parse(raw) } catch { return [] }
}

function toEntry(row: Row): unknown {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    links: parseLinks(row.links),
    category: row.category,
    order: Number(row.sort_order),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function list(params: ListParams): Promise<ListResult<unknown>> {
  const { sql: filterSql, params: filterParams } = buildFilters(params.filters, FILTERABLE)
  const { column, dir } = resolveSort(params.sort, SORTABLE, { column: 'ak.sort_order', dir: 'asc' })

  const searchSql = params.search ? ' AND (ak.title LIKE ? OR ak.content LIKE ?)' : ''
  const like = `%${params.search ?? ''}%`
  const searchParams = params.search ? [like, like] : []

  const where = `WHERE 1=1${filterSql}${searchSql}`
  const whereParams = [...filterParams, ...searchParams]

  const totalRow = await queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total FROM ai_knowledge ak ${where}`,
    whereParams,
  )

  const offset = (params.page - 1) * params.pageSize
  const rows = await query<Row>(
    `SELECT ak.* FROM ai_knowledge ak ${where} ORDER BY ${column} ${dir} LIMIT ? OFFSET ?`,
    [...whereParams, params.pageSize, offset],
  )

  return {
    items: rows.map(toEntry),
    total: Number(totalRow?.total ?? 0),
    page: params.page,
    pageSize: params.pageSize,
  }
}

export async function get(id: string): Promise<unknown> {
  const row = await queryOne<Row>('SELECT * FROM ai_knowledge WHERE id = ? LIMIT 1', [id])
  if (!row) throw notFound('Knowledge entry')
  return toEntry(row)
}

export async function create(input: AiKnowledgeInput): Promise<unknown> {
  const id = randomUUID()
  await execute(
    `INSERT INTO ai_knowledge (id, title, content, links, category, sort_order, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
    [id, input.title, input.content, JSON.stringify(input.links ?? []), input.category, input.order, input.status],
  )
  return get(id)
}

export async function update(id: string, patch: AiKnowledgePatch): Promise<unknown> {
  const existing = await queryOne<Row>('SELECT id FROM ai_knowledge WHERE id = ? LIMIT 1', [id])
  if (!existing) throw notFound('Knowledge entry')

  const mapping: Record<string, string> = {
    title: 'title',
    content: 'content',
    links: 'links',
    category: 'category',
    order: 'sort_order',
    status: 'status',
  }

  const assignments: string[] = []
  const params: unknown[] = []

  for (const [key, column] of Object.entries(mapping)) {
    const value = patch[key as keyof AiKnowledgePatch]
    if (value === undefined) continue
    assignments.push(`${column} = ?`)
    params.push(key === 'links' ? JSON.stringify(value) : value)
  }

  if (assignments.length > 0) {
    await execute(
      `UPDATE ai_knowledge SET ${assignments.join(', ')}, updated_at = NOW(3) WHERE id = ?`,
      [...params, id],
    )
  }

  return get(id)
}

export async function remove(ids: string[]): Promise<void> {
  if (ids.length === 0) return
  await query(`DELETE FROM ai_knowledge WHERE id IN (${ids.map(() => '?').join(',')})`, ids)
}
