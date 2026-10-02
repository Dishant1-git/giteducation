import { request } from '../client'
import type { ListParams, ListResult } from '../types'

export type CommentStatus = 'pending' | 'approved' | 'hidden' | 'reported'

export interface BlogComment {
  id: string
  blogId: string
  blogTitle: string
  blogSlug: string
  parentId?: string
  authorName: string
  /** Collected for moderation, never shown on the website. */
  authorEmail?: string
  /** True for a moderator's own reply, posted from this page rather than the public form. */
  isStaff: boolean
  body: string
  status: CommentStatus
  moderator?: string
  moderatedAt?: string
  createdAt: string
}

export const commentsApi = {
  list(params: ListParams): Promise<ListResult<BlogComment>> {
    return request('/comments', {
      query: {
        page: params.page,
        pageSize: params.pageSize,
        q: params.search,
        sort: params.sort?.field,
        dir: params.sort?.dir,
        ...(params.filters as Record<string, string | string[] | undefined>),
      },
    })
  },

  setStatus(ids: string[], status: CommentStatus): Promise<void> {
    return request('/comments/status', { method: 'POST', body: { ids, status } })
  },

  remove(ids: string[]): Promise<void> {
    return request('/comments', { method: 'DELETE', body: { ids } })
  },

  /** Posts a moderator reply, auto-approved and badged on the site as staff. */
  reply(id: string, body: string): Promise<{ id: string }> {
    return request(`/comments/${id}/reply`, { method: 'POST', body: { body } })
  },
}
