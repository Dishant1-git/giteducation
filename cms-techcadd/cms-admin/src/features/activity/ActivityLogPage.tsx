import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { activityApi } from '../../api/resources/activity'
import { Card, CardBody } from '../../components/common/Card'
import { Pagination } from '../../components/data/Pagination'
import { FormField } from '../../components/form/FormField'
import { Input } from '../../components/form/Input'
import { Select } from '../../components/form/Select'
import { SkeletonTable } from '../../components/feedback/Skeleton'
import { PageHeader } from '../../components/layout/PageHeader'
import { ActivityList } from './ActivityList'
import { boundsFor, RANGES, TYPE_WORDS, type RangeId } from './dateRanges'

const ACTIONS = [
  { value: '', label: 'Any action' },
  { value: 'created', label: 'Added' },
  { value: 'updated', label: 'Updated' },
  { value: 'published', label: 'Published' },
  { value: 'unpublished', label: 'Unpublished' },
  { value: 'deleted', label: 'Deleted' },
]

const TYPES = [
  { value: '', label: 'Any content' },
  ...Object.entries(TYPE_WORDS).map(([value, label]) => ({ value, label })),
]

const PAGE_SIZE = 50

/**
 * Everything that has happened, filterable.
 *
 * Admin-only at the route and at the API — the second is what matters; the
 * first only saves an editor from a menu entry that would refuse them.
 */
export default function ActivityLogPage() {
  const [range, setRange] = useState<RangeId>('month')
  const [custom, setCustom] = useState({ from: '', to: '' })
  const [entityType, setEntityType] = useState('')
  const [action, setAction] = useState('')
  const [userId, setUserId] = useState('')
  const [page, setPage] = useState(1)

  // People come from the contributions read rather than the users list: the
  // log can name someone whose account has since been removed, and the point
  // of the filter is to find what they did.
  const contributions = useQuery({
    queryKey: ['activity', 'contributions', 'all'],
    queryFn: () => activityApi.contributions({}),
  })

  const filters = useMemo(
    () => ({
      ...boundsFor(range, custom),
      entityType: entityType || undefined,
      action: action || undefined,
      userId: userId || undefined,
      page,
      pageSize: PAGE_SIZE,
    }),
    [range, custom, entityType, action, userId, page],
  )

  const log = useQuery({
    queryKey: ['activity', 'log', filters],
    queryFn: () => activityApi.log(filters),
  })

  /** Any filter change puts you back on page one; page 7 of a new query is nothing. */
  function change<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value)
      setPage(1)
    }
  }

  const people = [
    { value: '', label: 'Anyone' },
    ...(contributions.data?.people ?? [])
      .filter((person) => person.userId)
      .map((person) => ({ value: person.userId!, label: person.userName })),
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity log"
        description="Every change, in the order it happened. Records are kept even after the content is edited or removed."
      />

      <div className="flex flex-wrap items-end gap-3">
        <FormField label="Person" className="w-48">
          <Select value={userId} onChange={(e) => change(setUserId)(e.target.value)} options={people} />
        </FormField>
        <FormField label="Content" className="w-44">
          <Select
            value={entityType}
            onChange={(e) => change(setEntityType)(e.target.value)}
            options={TYPES}
          />
        </FormField>
        <FormField label="Action" className="w-40">
          <Select value={action} onChange={(e) => change(setAction)(e.target.value)} options={ACTIONS} />
        </FormField>
        <FormField label="Period" className="w-40">
          <Select
            value={range}
            onChange={(e) => change(setRange)(e.target.value as RangeId)}
            options={RANGES.map((option) => ({ value: option.id, label: option.label }))}
          />
        </FormField>

        {range === 'custom' && (
          <>
            <FormField label="From" className="w-40">
              <Input
                type="date"
                value={custom.from}
                onChange={(e) => change(setCustom)({ ...custom, from: e.target.value })}
              />
            </FormField>
            <FormField label="To" className="w-40">
              <Input
                type="date"
                value={custom.to}
                onChange={(e) => change(setCustom)({ ...custom, to: e.target.value })}
              />
            </FormField>
          </>
        )}
      </div>

      <Card flush>
        <CardBody className="p-0">
          {log.isLoading ? (
            <div className="p-4">
              <SkeletonTable />
            </div>
          ) : (
            <ActivityList entries={log.data?.items ?? []} />
          )}
        </CardBody>
      </Card>

      {(log.data?.total ?? 0) > PAGE_SIZE && (
        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={log.data?.total ?? 0}
          onPageChange={setPage}
          // Fixed page size here: the log is scanned, not paged through by
          // choice, and offering a size control that changes nothing else
          // would be a lever with nothing on the end of it.
          onPageSizeChange={() => {}}
        />
      )}
    </div>
  )
}
