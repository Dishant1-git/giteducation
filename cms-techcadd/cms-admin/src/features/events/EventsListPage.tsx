import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  ExternalLink,
  Image as ImageIcon,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'

import { ApiError } from '../../api'
import { assetUrl } from '../../api/client'
import { publicUrlFor } from '../../config/siteMap'
import { Badge, ContentStatusBadge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { DropdownItem, DropdownMenu, DropdownSeparator } from '../../components/common/DropdownMenu'
import { DataTable, type Column } from '../../components/data/DataTable'
import { FilterBar } from '../../components/data/FilterBar'
import { Pagination } from '../../components/data/Pagination'
import { Tabs } from '../../components/data/Tabs'
import { PageHeader } from '../../components/layout/PageHeader'
import { useConfirm } from '../../hooks/useConfirm'
import { useListParams } from '../../hooks/useListParams'
import { useToast } from '../../hooks/useToast'
import type { Event } from '../../types'
import { EVENT_TYPE_OPTIONS, formatEventDates, isUpcoming } from './eventSchema'
import { eventHooks } from './useEvents'

const TABS = [
  { value: '', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'review', label: 'In Review' },
]

const TYPE_LABELS = new Map(EVENT_TYPE_OPTIONS.map((option) => [option.value, option.label]))

export default function EventsListPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const confirm = useConfirm()

  const list = useListParams({
    filterKeys: ['status', 'eventType'],
    // Newest date first: the thing an editor came here to change is almost
    // always the next event or the one that just happened, not the oldest.
    defaultSort: { field: 'startsOn', dir: 'desc' },
  })
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const query = eventHooks.useList(list.params)
  const remove = eventHooks.useRemove()

  const columns = useMemo<Column<Event>[]>(
    () => [
      {
        id: 'title',
        header: 'Event',
        primary: true,
        sortable: true,
        cell: (event) => (
          <div className="flex items-center gap-3">
            {event.coverImage ? (
              <img
                src={assetUrl(event.coverImage.url)}
                alt=""
                width={40}
                height={40}
                className="size-10 shrink-0 rounded object-cover"
              />
            ) : (
              <span
                className="grid size-10 shrink-0 place-items-center rounded bg-slate-100 text-slate-400"
                aria-hidden="true"
              >
                <ImageIcon size={16} />
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-900">{event.title}</p>
              <p className="truncate text-xs text-slate-400">
                {event.hostName ? `with ${event.hostName}` : `/${event.slug}`}
              </p>
            </div>
          </div>
        ),
      },
      {
        id: 'startsOn',
        header: 'When',
        sortable: true,
        cell: (event) => (
          <div className="whitespace-nowrap">
            <p className="text-slate-700">{formatEventDates(event.startsOn, event.endsOn)}</p>
            {/* Upcoming or past, said plainly. The date alone makes a reader
                work out today's date to know which, and that is the first
                thing anyone wants from this row. */}
            <p className="text-xs text-slate-400">
              {isUpcoming(event) ? 'Upcoming' : 'Past'}
              {event.startTime ? ` · ${event.startTime}` : ''}
            </p>
          </div>
        ),
      },
      {
        id: 'eventType',
        header: 'Type',
        sortable: true,
        hideBelow: 'lg',
        cell: (event) => (
          <Badge tone="neutral">{TYPE_LABELS.get(event.eventType) ?? event.eventType}</Badge>
        ),
      },
      {
        id: 'venue',
        header: 'Where',
        hideBelow: 'xl',
        cell: (event) =>
          event.mode === 'online' ? (
            <span className="text-slate-500">Online</span>
          ) : event.venueName || event.city ? (
            <span className="truncate text-slate-500">
              {[event.venueName, event.city].filter(Boolean).join(', ')}
            </span>
          ) : (
            <span className="text-slate-400">—</span>
          ),
      },
      {
        id: 'status',
        header: 'Status',
        sortable: true,
        cell: (event) => <ContentStatusBadge status={event.status} />,
      },
    ],
    [],
  )

  async function deleteEvents(ids: string[], label: string) {
    const confirmed = await confirm({ title: `Delete ${label}?`, confirmLabel: 'Delete' })
    if (!confirmed) return

    try {
      await remove.mutateAsync(ids)
      setSelectedIds([])
      toast.success(`Deleted ${label}.`)
    } catch (error) {
      toast.error('Could not delete', {
        description: error instanceof ApiError ? error.message : 'Please try again.',
      })
    }
  }

  const rows = query.data?.items ?? []
  const total = query.data?.total ?? 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        description={
          query.isLoading ? 'Loading…' : `${total} ${total === 1 ? 'event' : 'events'} in total`
        }
        actions={
          <Link to="/events/new">
            <Button icon={Plus}>Add Event</Button>
          </Link>
        }
      />

      <Card flush>
        <Tabs
          value={list.filters.status ?? ''}
          onValueChange={(value) => list.setFilter('status', value || undefined)}
          items={TABS}
        />

        <FilterBar
          search={list.search}
          onSearchChange={list.setSearch}
          searchPlaceholder="Search by title, venue, host or tag"
        />

        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-primary-50/60 px-5 py-2.5">
            <p className="text-sm font-medium text-primary-900">{selectedIds.length} selected</p>
            <Button
              variant="secondary"
              size="sm"
              icon={Trash2}
              onClick={() =>
                deleteEvents(
                  selectedIds,
                  `${selectedIds.length} ${selectedIds.length === 1 ? 'event' : 'events'}`,
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
          rows={rows}
          columns={columns}
          getRowId={(event) => event.id}
          caption="All events with their dates, type, venue and status"
          loading={query.isLoading}
          error={query.error as Error | null}
          onRetry={() => query.refetch()}
          sort={list.sort}
          onSortChange={list.setSort}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onRowClick={(event) => navigate(`/events/${event.id}/edit`)}
          emptyIcon={CalendarDays}
          emptyTitle={list.search ? 'No matching events' : 'No events yet'}
          emptyDescription={
            list.search
              ? 'Try a different search term.'
              : 'Add the next seminar or workshop and it appears under Resources on the website.'
          }
          rowActions={(event) => (
            <DropdownMenu
              trigger={
                <Button variant="ghost" size="sm" aria-label={`Actions for ${event.title}`}>
                  <MoreHorizontal size={16} aria-hidden="true" />
                </Button>
              }
            >
              <DropdownItem icon={Pencil} onSelect={() => navigate(`/events/${event.id}/edit`)}>
                Edit
              </DropdownItem>
              {event.status === 'published' && publicUrlFor('events', event) && (
                <DropdownItem
                  icon={ExternalLink}
                  onSelect={() => window.open(publicUrlFor('events', event), '_blank', 'noopener')}
                >
                  View on site
                </DropdownItem>
              )}
              <DropdownSeparator />
              <DropdownItem
                icon={Trash2}
                tone="danger"
                onSelect={() => deleteEvents([event.id], event.title)}
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          )}
        />

        {total > 0 && (
          <Pagination
            page={list.page}
            pageSize={list.pageSize}
            total={total}
            onPageChange={list.setPage}
            onPageSizeChange={list.setPageSize}
          />
        )}
      </Card>
    </div>
  )
}
