import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BrainCircuit, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'

import { ApiError, type ListParams } from '../../api'
import { ContentStatusBadge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { DropdownItem, DropdownMenu, DropdownSeparator } from '../../components/common/DropdownMenu'
import { DataTable, type Column } from '../../components/data/DataTable'
import { FilterBar } from '../../components/data/FilterBar'
import { PageHeader } from '../../components/layout/PageHeader'
import { useConfirm } from '../../hooks/useConfirm'
import { useToast } from '../../hooks/useToast'
import type { AiKnowledge } from '../../types'
import { aiKnowledgeHooks } from './useAiKnowledge'

const ALL_PARAMS: ListParams = { page: 1, pageSize: 200, sort: { field: 'order', dir: 'asc' } }

export default function AiKnowledgeListPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()
  const [search, setSearch] = useState('')

  const query = aiKnowledgeHooks.useList(ALL_PARAMS)
  const remove = aiKnowledgeHooks.useRemove()

  const rows = useMemo(() => {
    const items = query.data?.items ?? []
    if (!search) return items
    const q = search.toLowerCase()
    return items.filter(
      (item) => item.title.toLowerCase().includes(q) || item.content.toLowerCase().includes(q),
    )
  }, [query.data, search])

  const columns = useMemo<Column<AiKnowledge>[]>(
    () => [
      {
        id: 'title',
        header: 'Title',
        primary: true,
        cell: (item) => (
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900">{item.title}</p>
            <p className="mt-0.5 truncate text-xs text-slate-400">{item.category}</p>
          </div>
        ),
      },
      {
        id: 'content',
        header: 'Preview',
        hideBelow: 'lg',
        cell: (item) => (
          <p className="max-w-xs truncate text-sm text-slate-500">
            {item.content.slice(0, 100)}…
          </p>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        cell: (item) => <ContentStatusBadge status={item.status} />,
      },
    ],
    [],
  )

  async function deleteEntry(item: AiKnowledge) {
    const confirmed = await confirm({ title: `Delete "${item.title}"?`, confirmLabel: 'Delete' })
    if (!confirmed) return
    try {
      await remove.mutateAsync([item.id])
      toast.success('Entry deleted.')
    } catch (error) {
      toast.error('Could not delete', {
        description: error instanceof ApiError ? error.message : 'Please try again.',
      })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Knowledge Base"
        description="Write knowledge like a book — the website assistant reads it and answers visitor questions automatically. Only published entries are active."
        actions={
          <Link to="/ai-knowledge/new">
            <Button icon={Plus}>Add Entry</Button>
          </Link>
        }
      />

      <Card flush>
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search knowledge entries"
        />

        <DataTable
          rows={rows}
          columns={columns}
          getRowId={(item) => item.id}
          caption="AI knowledge base entries"
          loading={query.isLoading}
          error={query.error as Error | null}
          onRetry={() => query.refetch()}
          onRowClick={(item) => navigate(`/ai-knowledge/${item.id}/edit`)}
          emptyIcon={BrainCircuit}
          emptyTitle={search ? 'No matching entries' : 'No knowledge entries yet'}
          emptyDescription={
            search
              ? 'Try a different search term.'
              : 'Add text data that the assistant will use to answer visitor questions.'
          }
          rowActions={(item) => (
            <DropdownMenu
              trigger={
                <Button variant="ghost" size="sm" aria-label={`Actions for ${item.title}`}>
                  <MoreHorizontal size={16} />
                </Button>
              }
            >
              <DropdownItem
                icon={Pencil}
                onSelect={() => navigate(`/ai-knowledge/${item.id}/edit`)}
              >
                Edit
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem icon={Trash2} tone="danger" onSelect={() => deleteEntry(item)}>
                Delete
              </DropdownItem>
            </DropdownMenu>
          )}
        />
      </Card>
    </div>
  )
}
