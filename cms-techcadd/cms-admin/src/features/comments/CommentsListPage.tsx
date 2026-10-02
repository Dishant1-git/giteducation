import { useMemo, useState } from 'react'
import {
  Check,
  EyeOff,
  MessageSquare,
  MessageSquareReply,
  MoreHorizontal,
  ShieldCheck,
  Trash2,
} from 'lucide-react'

import { ApiError, type ListParams } from '../../api'
import type { BlogComment, CommentStatus } from '../../api'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { DropdownItem, DropdownMenu, DropdownSeparator } from '../../components/common/DropdownMenu'
import { Modal } from '../../components/common/Modal'
import { DataTable, type Column } from '../../components/data/DataTable'
import { Tabs } from '../../components/data/Tabs'
import { Textarea } from '../../components/form/Textarea'
import { PageHeader } from '../../components/layout/PageHeader'
import { useConfirm } from '../../hooks/useConfirm'
import { useToast } from '../../hooks/useToast'
import { useCommentsList, useRemoveComments, useReplyToComment, useSetCommentStatus } from './useComments'

const TABS: { value: CommentStatus | 'all'; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'hidden', label: 'Declined' },
  { value: 'reported', label: 'Reported' },
  { value: 'all', label: 'All' },
]

const STATUS_META: Record<CommentStatus, { label: string; tone: 'warning' | 'success' | 'neutral' | 'danger' }> = {
  pending: { label: 'Pending', tone: 'warning' },
  approved: { label: 'Approved', tone: 'success' },
  hidden: { label: 'Declined', tone: 'neutral' },
  reported: { label: 'Reported', tone: 'danger' },
}

/**
 * The moderation queue.
 *
 * Every comment on every post, in one list — the same reasoning as the
 * Enquiries inbox: a moderator works from "what needs a decision today", not
 * one post at a time. Pending is the default tab because that is the actual
 * queue; the others are where something already decided goes to be found
 * again.
 */
export default function CommentsListPage() {
  const toast = useToast()
  const confirm = useConfirm()

  const [tab, setTab] = useState<CommentStatus | 'all'>('pending')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [replyTarget, setReplyTarget] = useState<BlogComment | null>(null)
  const [replyBody, setReplyBody] = useState('')

  const params: ListParams = useMemo(
    () => ({
      page: 1,
      pageSize: 200,
      sort: { field: 'createdAt', dir: 'desc' },
      filters: tab === 'all' ? {} : { status: tab },
    }),
    [tab],
  )

  const query = useCommentsList(params)
  const setStatus = useSetCommentStatus()
  const remove = useRemoveComments()
  const reply = useReplyToComment()

  const comments = query.data?.items ?? []

  async function act(ids: string[], status: CommentStatus, successMessage: string) {
    try {
      await setStatus.mutateAsync({ ids, status })
      toast.success(successMessage)
      setSelectedIds([])
    } catch (error) {
      toast.error('Could not update', {
        description: error instanceof ApiError ? error.message : 'Please try again.',
      })
    }
  }

  async function deleteComments(ids: string[], description: string) {
    const confirmed = await confirm({
      title: ids.length === 1 ? 'Delete this comment?' : `Delete ${ids.length} comments?`,
      description,
      confirmLabel: 'Delete',
    })
    if (!confirmed) return

    try {
      await remove.mutateAsync(ids)
      toast.success(ids.length === 1 ? 'Comment deleted.' : 'Comments deleted.')
      setSelectedIds([])
    } catch (error) {
      toast.error('Could not delete', {
        description: error instanceof ApiError ? error.message : 'Please try again.',
      })
    }
  }

  async function submitReply() {
    if (!replyTarget || replyBody.trim().length < 2) return
    try {
      await reply.mutateAsync({ id: replyTarget.id, body: replyBody.trim() })
      toast.success('Reply posted — it is live on the site now.')
      setReplyTarget(null)
      setReplyBody('')
    } catch (error) {
      toast.error('Could not post reply', {
        description: error instanceof ApiError ? error.message : 'Please try again.',
      })
    }
  }

  const columns: Column<BlogComment>[] = [
    {
      id: 'comment',
      header: 'Comment',
      primary: true,
      cell: (comment) => (
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-medium text-slate-900">{comment.authorName}</p>
            {comment.isStaff && (
              <Badge tone="primary">
                <ShieldCheck size={11} /> Team
              </Badge>
            )}
            {comment.parentId && !comment.isStaff && (
              <span className="text-xs text-slate-400">replying</span>
            )}
          </div>
          <p className="mt-0.5 line-clamp-2 text-sm text-slate-600">{comment.body}</p>
        </div>
      ),
    },
    {
      id: 'post',
      header: 'Post',
      hideBelow: 'md',
      cell: (comment) => (
        <span className="text-sm text-slate-600">{comment.blogTitle}</span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      hideBelow: 'sm',
      cell: (comment) => {
        const meta = STATUS_META[comment.status]
        return (
          <Badge tone={meta.tone} withDot>
            {meta.label}
          </Badge>
        )
      },
    },
    {
      id: 'createdAt',
      header: 'Posted',
      hideBelow: 'lg',
      cell: (comment) => (
        <span className="text-sm whitespace-nowrap text-slate-500">
          {new Date(comment.createdAt.replace(' ', 'T')).toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comments"
        description="What readers are saying under each post, and what to do about it"
      />

      <Card flush>
        <Tabs
          value={tab}
          onValueChange={(value) => {
            setTab(value as CommentStatus | 'all')
            setSelectedIds([])
          }}
          items={TABS}
        />

        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-slate-50 px-5 py-3">
            <span className="text-sm font-medium text-slate-600">
              {selectedIds.length} selected
            </span>
            <div className="ml-auto flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="secondary"
                icon={Check}
                onClick={() => act(selectedIds, 'approved', 'Comments approved.')}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="secondary"
                icon={EyeOff}
                onClick={() => act(selectedIds, 'hidden', 'Comments declined.')}
              >
                Decline
              </Button>
              <Button
                size="sm"
                variant="danger"
                icon={Trash2}
                onClick={() =>
                  deleteComments(
                    selectedIds,
                    'This removes the comment and any replies under it. This cannot be undone.',
                  )
                }
              >
                Delete
              </Button>
            </div>
          </div>
        )}

        <DataTable
          rows={comments}
          columns={columns}
          getRowId={(comment) => comment.id}
          caption="Blog comments with their post, status and moderation actions"
          loading={query.isLoading}
          error={query.error as Error | null}
          onRetry={() => query.refetch()}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          emptyIcon={MessageSquare}
          emptyTitle={tab === 'pending' ? 'Nothing waiting on you' : 'No comments here'}
          emptyDescription={
            tab === 'pending'
              ? 'New comments land here first. Nothing to review right now.'
              : 'Comments matching this tab will appear here.'
          }
          rowActions={(comment) => (
            <DropdownMenu
              trigger={
                <Button variant="ghost" size="sm" aria-label={`Actions for the comment from ${comment.authorName}`}>
                  <MoreHorizontal size={16} />
                </Button>
              }
            >
              {comment.status !== 'approved' && (
                <DropdownItem icon={Check} onSelect={() => act([comment.id], 'approved', 'Comment approved.')}>
                  Approve
                </DropdownItem>
              )}
              {comment.status !== 'hidden' && (
                <DropdownItem icon={EyeOff} onSelect={() => act([comment.id], 'hidden', 'Comment declined.')}>
                  Decline
                </DropdownItem>
              )}
              <DropdownItem
                icon={MessageSquareReply}
                onSelect={() => {
                  setReplyTarget(comment)
                  setReplyBody('')
                }}
              >
                Reply
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem
                icon={Trash2}
                tone="danger"
                onSelect={() =>
                  deleteComments(
                    [comment.id],
                    'This removes the comment and any replies under it. This cannot be undone.',
                  )
                }
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          )}
        />
      </Card>

      <Modal
        open={replyTarget !== null}
        onOpenChange={(open) => {
          if (!open) setReplyTarget(null)
        }}
        title="Reply as GIT Education"
        description={replyTarget ? `Replying to ${replyTarget.authorName}'s comment` : undefined}
        dismissible={!reply.isPending}
        footer={
          <>
            <Button variant="secondary" onClick={() => setReplyTarget(null)} disabled={reply.isPending}>
              Cancel
            </Button>
            <Button
              onClick={submitReply}
              disabled={reply.isPending || replyBody.trim().length < 2}
            >
              {reply.isPending ? 'Posting…' : 'Post reply'}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          {replyTarget && (
            <blockquote className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 italic">
              “{replyTarget.body}”
            </blockquote>
          )}
          <Textarea
            value={replyBody}
            onChange={(event) => setReplyBody(event.target.value)}
            rows={4}
            placeholder="Thanks for asking — here's how that actually works..."
            maxLength={4000}
          />
          <p className="text-xs text-slate-500">
            Posted immediately, under your name, with a "Team" badge — no approval step, since you're the one approving.
          </p>
        </div>
      </Modal>
    </div>
  )
}
