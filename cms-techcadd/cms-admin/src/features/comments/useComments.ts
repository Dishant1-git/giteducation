import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { commentsApi, type CommentStatus } from '../../api'
import type { ListParams } from '../../api'

/**
 * Hand-written rather than `createResourceHooks`: comments have no
 * create-new or edit-by-id form, and status changes and replies are their
 * own endpoints rather than a generic `update`. The five-hook factory does
 * not fit a moderation queue.
 */
const KEY = 'comments'

export function useCommentsList(params: ListParams) {
  return useQuery({ queryKey: [KEY, 'list', params], queryFn: () => commentsApi.list(params) })
}

export function useSetCommentStatus() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: CommentStatus }) =>
      commentsApi.setStatus(ids, status),
    onSuccess: () => client.invalidateQueries({ queryKey: [KEY] }),
  })
}

export function useRemoveComments() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => commentsApi.remove(ids),
    onSuccess: () => client.invalidateQueries({ queryKey: [KEY] }),
  })
}

export function useReplyToComment() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: string }) => commentsApi.reply(id, body),
    // A reply is itself a new (approved) comment row, so the same
    // invalidation that picks up a status change picks up the reply too.
    onSuccess: () => client.invalidateQueries({ queryKey: [KEY] }),
  })
}
