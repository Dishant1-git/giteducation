import { createHash, randomUUID } from 'node:crypto'

import { execute, query, queryOne, type Row } from '../../db/pool.js'
import { badRequest, notFound } from '../../http/errors.js'
import { buildFilters, resolveSort, type ListParams } from '../../http/listParams.js'

/**
 * Comments on published posts.
 *
 * Held for review before they appear — the CMS admin's Comments page is the
 * moderation queue, and approving, hiding, replying to or deleting a comment
 * from there is real. (An earlier version of this file auto-approved on
 * insert, on the reasoning that a queue nobody looks at is the same as
 * comments being off; that reasoning no longer applies now that something
 * does look at it.)
 *
 * What protects the queue itself from being flooded: a honeypot field no
 * person fills in, a rate limit per sender, and a sanitiser that strips
 * markup on the way in as well as rendering as text on the way out.
 */

export interface CommentInput {
  blogSlug: string
  parentId?: string
  authorName: string
  authorEmail?: string
  body: string
}

/**
 * Strips anything that could be markup, and collapses runaway whitespace.
 *
 * The website renders comment bodies as text, so this is the second line of
 * defence rather than the only one — but a stored `<script>` is a liability
 * whatever the renderer promises today, and the person who changes the
 * renderer in a year will not know that promise was load-bearing.
 */
function sanitise(text: string): string {
  return (
    text
      // Script and style blocks go whole, contents included. Stripping the
      // tags alone would leave the code behind as text, which is harmless
      // to render but reads as gibberish and hides what was attempted.
      .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/<[^>]*>/g, '')
      // Control characters, which no comment needs and which can break a
      // log line downstream. Tab and newline are deliberately kept.
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  )
}

/** A sender, as something countable rather than as a person. */
export function hashAddress(address: string | undefined): string | null {
  if (!address) return null
  return createHash('sha256').update(address).digest('hex')
}

/**
 * Refuses a flood from one sender.
 *
 * Rate limiting by address rather than by session, because there is no
 * session: an anonymous form has nothing else to key on. Deliberately
 * generous — the cost of a false positive is a real person told to wait, and
 * moderation already catches what this misses.
 */
export async function tooManyRecently(ipHash: string | null): Promise<boolean> {
  if (!ipHash) return false
  const row = await queryOne<{ n: number }>(
    `SELECT COUNT(*) AS n FROM blog_comments
      WHERE ip_hash = ? AND created_at > DATE_SUB(NOW(3), INTERVAL 10 MINUTE)`,
    [ipHash],
  )
  return Number(row?.n ?? 0) >= 5
}

export async function create(input: CommentInput, ipHash: string | null): Promise<string> {
  const blog = await queryOne<Row>(
    `SELECT id FROM blogs WHERE slug = ? AND status = 'published' LIMIT 1`,
    [input.blogSlug],
  )
  // A draft has no public page, so a comment on one could only have come from
  // somebody constructing the request by hand.
  if (!blog) throw notFound('Post')

  const blogId = blog.id as string

  if (input.parentId) {
    const parent = await queryOne<Row>(
      'SELECT id, blog_id, parent_id FROM blog_comments WHERE id = ? LIMIT 1',
      [input.parentId],
    )
    if (!parent) throw badRequest('That comment no longer exists.')
    // Replying across posts would put a comment somewhere its parent is not.
    if (parent.blog_id !== blogId) throw badRequest('That comment is on a different post.')
    /*
      Two levels, not unlimited.

      A thread that can nest forever indents itself off the side of a phone,
      and the third level of a reply chain is nearly always addressed to the
      original comment anyway. Replies to a reply attach to the same parent.
    */
    if (parent.parent_id) input.parentId = parent.parent_id as string
  }

  const id = randomUUID()
  await execute(
    `INSERT INTO blog_comments
       (id, blog_id, parent_id, author_name, author_email, body, status, ip_hash, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, NOW(3), NOW(3))`,
    [
      id,
      blogId,
      input.parentId ?? null,
      sanitise(input.authorName).slice(0, 80),
      input.authorEmail?.trim().slice(0, 190) || null,
      sanitise(input.body),
      ipHash,
    ],
  )
  return id
}

/**
 * A moderator's reply, posted from the CMS.
 *
 * Auto-approved and stamped `is_staff`, unlike a visitor's comment: an
 * authenticated admin does not need their own reply held for their own
 * approval, and the flag is what lets the website badge it as an official
 * reply rather than another stranger's comment.
 *
 * Threading matches the public form's: a reply to a reply attaches to the
 * original comment, so a staff reply on a reply still lands at two levels
 * deep rather than three.
 */
export async function replyAsStaff(
  parentId: string,
  body: string,
  authorName: string,
  userId: string,
): Promise<string> {
  const parent = await queryOne<Row>(
    'SELECT id, blog_id, parent_id FROM blog_comments WHERE id = ? LIMIT 1',
    [parentId],
  )
  if (!parent) throw notFound('Comment')

  const attachTo = (parent.parent_id as string | null) ?? (parent.id as string)

  const id = randomUUID()
  await execute(
    `INSERT INTO blog_comments
       (id, blog_id, parent_id, author_name, is_staff, body, status, moderated_by, moderated_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, TRUE, ?, 'approved', ?, NOW(3), NOW(3), NOW(3))`,
    [id, parent.blog_id, attachTo, authorName.slice(0, 80), sanitise(body), userId],
  )
  return id
}

/** Approved comments on one post, threaded. */
export async function publicThread(blogSlug: string) {
  const rows = await query<Row>(
    `SELECT c.id, c.parent_id, c.author_name, c.is_staff, c.body, c.created_at
       FROM blog_comments c
       JOIN blogs b ON b.id = c.blog_id
      WHERE b.slug = ? AND b.status = 'published' AND c.status = 'approved'
      ORDER BY c.created_at ASC`,
    [blogSlug],
  )

  type Node = {
    id: string
    authorName: string
    isStaff: boolean
    body: string
    createdAt: string
    replies: Node[]
  }

  const byId = new Map<string, Node>()
  const roots: Node[] = []

  for (const row of rows) {
    byId.set(row.id as string, {
      id: row.id as string,
      authorName: row.author_name as string,
      isStaff: Boolean(row.is_staff),
      body: row.body as string,
      createdAt: row.created_at as string,
      replies: [],
    })
  }

  for (const row of rows) {
    const node = byId.get(row.id as string)!
    const parent = row.parent_id ? byId.get(row.parent_id as string) : undefined
    // An approved reply whose parent is not approved is promoted rather than
    // dropped: the reply passed moderation on its own merits, and hiding it
    // because of its neighbour would silently discard approved content.
    if (parent) parent.replies.push(node)
    else roots.push(node)
  }

  return roots
}

/** How many approved comments each post has, for the CMS list. */
export async function countsByBlog(): Promise<Map<string, number>> {
  const rows = await query<Row>(
    `SELECT blog_id, COUNT(*) AS n FROM blog_comments
      WHERE status = 'approved' GROUP BY blog_id`,
  )
  return new Map(rows.map((row) => [row.blog_id as string, Number(row.n ?? 0)]))
}

const SORTABLE: Record<string, string> = {
  createdAt: 'c.created_at',
  authorName: 'c.author_name',
  status: 'c.status',
}

const FILTERABLE: Record<string, string> = {
  status: 'c.status',
  blogId: 'c.blog_id',
}

/** The moderation queue. */
export async function list(params: ListParams) {
  const { sql: filterSql, params: filterParams } = buildFilters(params.filters, FILTERABLE)
  const { column, dir } = resolveSort(params.sort, SORTABLE, {
    column: 'c.created_at',
    dir: 'desc',
  })

  const searchSql = params.search
    ? ' AND (c.author_name LIKE ? OR c.body LIKE ? OR b.title LIKE ?)'
    : ''
  const like = `%${params.search ?? ''}%`
  const searchParams = params.search ? [like, like, like] : []

  const where = `WHERE 1=1${filterSql}${searchSql}`
  const whereParams = [...filterParams, ...searchParams]

  const totalRow = await queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total FROM blog_comments c JOIN blogs b ON b.id = c.blog_id ${where}`,
    whereParams,
  )

  const rows = await query<Row>(
    `SELECT c.*, b.title AS blog_title, b.slug AS blog_slug, u.name AS moderator
       FROM blog_comments c
       JOIN blogs b ON b.id = c.blog_id
       LEFT JOIN users u ON u.id = c.moderated_by
      ${where} ORDER BY ${column} ${dir} LIMIT ? OFFSET ?`,
    [...whereParams, params.pageSize, (params.page - 1) * params.pageSize],
  )

  return {
    items: rows.map((row) => ({
      id: row.id,
      blogId: row.blog_id,
      blogTitle: row.blog_title,
      blogSlug: row.blog_slug,
      parentId: row.parent_id ?? undefined,
      authorName: row.author_name,
      authorEmail: row.author_email ?? undefined,
      isStaff: Boolean(row.is_staff),
      body: row.body,
      status: row.status,
      moderator: row.moderator ?? undefined,
      moderatedAt: row.moderated_at ?? undefined,
      createdAt: row.created_at,
    })),
    total: Number(totalRow?.total ?? 0),
    page: params.page,
    pageSize: params.pageSize,
  }
}

/** Approve, hide, or mark reported. */
export async function setStatus(
  ids: string[],
  status: 'approved' | 'hidden' | 'reported' | 'pending',
  userId: string,
): Promise<void> {
  if (ids.length === 0) return
  const placeholders = ids.map(() => '?').join(',')
  await execute(
    `UPDATE blog_comments
        SET status = ?, moderated_by = ?, moderated_at = NOW(3), updated_at = NOW(3)
      WHERE id IN (${placeholders})`,
    [status, userId, ...ids],
  )
}

export async function remove(ids: string[]): Promise<void> {
  if (ids.length === 0) return
  const placeholders = ids.map(() => '?').join(',')
  await execute(`DELETE FROM blog_comments WHERE id IN (${placeholders})`, ids)
}

/** Reported by a reader. No account needed, so no moderator is recorded. */
export async function report(id: string): Promise<void> {
  const affected = await execute(
    `UPDATE blog_comments SET status = 'reported', updated_at = NOW(3)
      WHERE id = ? AND status = 'approved'`,
    [id],
  )
  // Silent either way: telling a reporter that a comment was already hidden,
  // or never existed, is a way to probe the table.
  void affected
}
