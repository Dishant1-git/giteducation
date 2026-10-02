import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { activityApi } from '../../api/resources/activity'
import { Card, CardBody, CardHeader } from '../../components/common/Card'
import { FormField } from '../../components/form/FormField'
import { Select } from '../../components/form/Select'
import { SkeletonTable } from '../../components/feedback/Skeleton'
import { PageHeader } from '../../components/layout/PageHeader'
import { ActivityList } from './ActivityList'
import { boundsFor, formatWhen, RANGES, TYPE_WORDS, type RangeId } from './dateRanges'

/** One person's record: what they have contributed, and everything they did. */
export default function PersonContributionsPage() {
  const { userId = '' } = useParams()
  const [range, setRange] = useState<RangeId>('all')

  const bounds = useMemo(() => boundsFor(range), [range])

  const detail = useQuery({
    queryKey: ['activity', 'person', userId, bounds],
    queryFn: () => activityApi.person(userId, { ...bounds, pageSize: 100 }),
    enabled: Boolean(userId),
  })

  const person = detail.data?.person

  return (
    <div className="space-y-6">
      <Link
        to="/team-contributions"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={15} aria-hidden="true" />
        All contributions
      </Link>

      <PageHeader
        title={person?.userName ?? 'Contributor'}
        description={
          person
            ? `${person.added} pieces added — ${person.share}% of everything the team added in this period.`
            : undefined
        }
      />

      <FormField label="Period" className="w-48">
        <Select
          value={range}
          onChange={(event) => setRange(event.target.value as RangeId)}
          options={RANGES.filter((option) => option.id !== 'custom').map((option) => ({
            value: option.id,
            label: option.label,
          }))}
        />
      </FormField>

      {detail.isLoading ? (
        <SkeletonTable />
      ) : !person ? (
        <Card flush>
          <CardBody>
            <p className="text-sm text-slate-500">
              Nothing recorded for this person in this period.
            </p>
          </CardBody>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Added', person.added],
              ['Updated', person.updated],
              ['Published', person.published],
              ['Deleted', person.deleted],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                  {label}
                </p>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card flush>
              <CardHeader title="What they worked on" />
              <CardBody className="space-y-2">
                {(detail.data?.types ?? []).length === 0 ? (
                  <p className="text-sm text-slate-500">Nothing in this period.</p>
                ) : (
                  detail.data!.types.map((type) => (
                    <div key={type.entityType} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">
                        {TYPE_WORDS[type.entityType] ?? type.entityType}
                      </span>
                      <span className="text-sm tabular-nums text-slate-800">
                        {type.added} added, {type.updated} updated
                      </span>
                    </div>
                  ))
                )}
              </CardBody>
            </Card>

            <Card flush>
              <CardHeader title="Span" />
              <CardBody className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">First activity</span>
                  <span className="text-slate-800">{formatWhen(person.firstAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Last activity</span>
                  <span className="text-slate-800">{formatWhen(person.lastAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Actions in total</span>
                  <span className="tabular-nums text-slate-800">{person.actions}</span>
                </div>
              </CardBody>
            </Card>
          </div>

          <Card flush>
            <CardHeader
              title="History"
              subtitle={`${detail.data?.activity.total ?? 0} recorded actions.`}
            />
            <CardBody className="p-0">
              <ActivityList entries={detail.data?.activity.items ?? []} showPerson={false} />
            </CardBody>
          </Card>
        </>
      )}
    </div>
  )
}
