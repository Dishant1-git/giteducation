import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CircleHelp, MoreHorizontal, Pencil, Plus, Star, Trash2 } from 'lucide-react'

import { ApiError, type ListParams } from '../../api'
import { Badge, ContentStatusBadge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { DropdownItem, DropdownMenu, DropdownSeparator } from '../../components/common/DropdownMenu'
import { DataTable, type Column } from '../../components/data/DataTable'
import { PageHeader } from '../../components/layout/PageHeader'
import { useConfirm } from '../../hooks/useConfirm'
import { useToast } from '../../hooks/useToast'
import type { Faq } from '../../types'
import { faqHooks } from './useFaqs'

/**
 * Every question at once.
 *
 * Questions are hand-ordered within a category and there are rarely more than
 * a few dozen, so paginating would only make reordering harder.
 */
const ALL: ListParams = { page: 1, pageSize: 500, sort: { field: 'order', dir: 'asc' } }

export default function FaqsListPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()

  const query = faqHooks.useList(ALL)
  const update = faqHooks.useUpdate()
  const remove = faqHooks.useRemove()

  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const faqs = useMemo(() => query.data?.items ?? [], [query.data])

  /**
   * Deletes one question or a selection of them.
   *
   * One function for both, so the confirmation, the toast and the clearing of
   * the selection cannot drift apart between the row menu and the toolbar.
   * `description` carries the question itself when there is exactly one, which
   * is the only case where quoting it helps somebody confirm.
   */
  async function deleteFaqs(ids: string[], label: string, description?: string) {
    const confirmed = await confirm({
      title: `Delete ${label}?`,
      description,
      confirmLabel: 'Delete',
    })
    if (!confirmed) return

    try {
      await remove.mutateAsync(ids)
      setSelectedIds([])
      toast.success(ids.length === 1 ? 'Question deleted.' : `Deleted ${label}.`)
    } catch (error) {
      toast.error('Could not delete', {
        description: error instanceof ApiError ? error.message : 'Please try again.',
      })
    }
  }

  async function toggleFeatured(faq: Faq) {
    try {
      await update.mutateAsync({ id: faq.id, input: { featured: !faq.featured } })
      toast.success(faq.featured ? 'Removed from the homepage.' : 'Added to the homepage.')
    } catch {
      toast.error('Could not update this question')
    }
  }

  const columns: Column<Faq>[] = [
    {
      id: 'question',
      header: 'Question',
      cell: (faq) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-900">{faq.question}</p>
          <p className="truncate text-xs text-slate-500">{faq.answer}</p>
        </div>
      ),
    },
    {
      id: 'category',
      header: 'Category',
      cell: (faq) => <Badge tone="neutral">{faq.category}</Badge>,
    },
    {
      id: 'featured',
      header: 'Homepage',
      cell: (faq) =>
        faq.featured ? <Badge tone="primary">Featured</Badge> : <span className="text-slate-400">—</span>,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (faq) => <ContentStatusBadge status={faq.status} />,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="FAQ"
        description="Questions the centre answers on the phone, grouped by section"
        actions={
          <Link to="/faqs/new">
            <Button icon={Plus}>Add question</Button>
          </Link>
        }
      />

      <Card flush>
        {/* The toolbar the checkboxes had nothing to talk to — see the note on
            the same bar in ReviewsListPage. */}
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-primary-50/60 px-5 py-2.5">
            <p className="text-sm font-medium text-primary-900">{selectedIds.length} selected</p>
            <Button
              variant="secondary"
              size="sm"
              icon={Trash2}
              onClick={() =>
                deleteFaqs(
                  selectedIds,
                  `${selectedIds.length} ${selectedIds.length === 1 ? 'question' : 'questions'}`,
                )
              }
            >
              Delete
            </Button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-sm font-medium text-primary-700 hover:text-primary-800"
            >
              Clear selection
            </button>
          </div>
        )}

        <DataTable
          rows={faqs}
          columns={columns}
          getRowId={(faq) => faq.id}
          caption="Frequently asked questions with their category and status"
          loading={query.isLoading}
          error={query.error as Error | null}
          onRetry={() => query.refetch()}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onRowClick={(faq) => navigate(`/faqs/${faq.id}/edit`)}
          emptyIcon={CircleHelp}
          emptyTitle="No questions yet"
          emptyDescription="Add the questions people ask most and they will appear on the site."
          rowActions={(faq) => (
            <DropdownMenu
              trigger={
                <Button variant="ghost" size="sm" aria-label={`Actions for this question`}>
                  <MoreHorizontal size={16} />
                </Button>
              }
            >
              <DropdownItem icon={Pencil} onSelect={() => navigate(`/faqs/${faq.id}/edit`)}>
                Edit
              </DropdownItem>
              <DropdownItem icon={Star} onSelect={() => toggleFeatured(faq)}>
                {faq.featured ? 'Remove from homepage' : 'Show on homepage'}
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem
                icon={Trash2}
                tone="danger"
                onSelect={() => deleteFaqs([faq.id], 'this question', faq.question)}
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          )}
        />
      </Card>
    </div>
  )
}
