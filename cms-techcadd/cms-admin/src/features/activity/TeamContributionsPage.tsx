import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Activity, FileText, TrendingUp, Users } from 'lucide-react'

import { activityApi, type PersonContribution } from '../../api/resources/activity'
import { Card, CardBody, CardHeader } from '../../components/common/Card'
import { EmptyState } from '../../components/common/EmptyState'
import { PageHeader } from '../../components/layout/PageHeader'
import { Select } from '../../components/form/Select'
import { Input } from '../../components/form/Input'
import { FormField } from '../../components/form/FormField'
import { SkeletonTable } from '../../components/feedback/Skeleton'
import { boundsFor, formatWhen, RANGES, TYPE_WORDS, type RangeId } from './dateRanges'

/** The content columns the table breaks contributions down by. */
const COLUMNS = ['blogs', 'courses', 'faqs', 'reviews', 'pages', 'testimonials'] as const

/** A stat tile. Plain numbers, because these are counts and not trends. */
function Stat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Users
  label: string
  value: number | string
  hint?: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon size={15} aria-hidden="true" />
        <span className="text-xs font-medium tracking-wide uppercase">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
    </div>
  )
}

/**
 * Share of what the team added, as a bar.
 *
 * Width is the number; the number is also printed. A bar alone asks the reader
 * to estimate, and these figures are the sort people quote at each other.
 */
function ShareBar({ person }: { person: PersonContribution }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-primary-500"
          style={{ width: `${Math.min(100, person.share)}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-slate-500">{person.share}%</span>
    </div>
  )
}

export default function TeamContributionsPage() {
  const [range, setRange] = useState<RangeId>('month')
  const [custom, setCustom] = useState({ from: '', to: '' })

  const bounds = useMemo(() => boundsFor(range, custom), [range, custom])

  const contributions = useQuery({
    queryKey: ['activity', 'contributions', bounds],
    queryFn: () => activityApi.contributions(bounds),
  })

  const data = contributions.data
  const busiestDay = useMemo(() => {
    if (!data?.trend.length) return null
    return data.trend.reduce((best, day) => (day.added > best.added ? day : best))
  }, [data])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team contributions"
        description="Who added what, counted from the activity log. Everyone works in the same CMS; this is the record of it."
      />

      <div className="flex flex-wrap items-end gap-3">
        <FormField label="Period" className="w-48">
          <Select
            value={range}
            onChange={(event) => setRange(event.target.value as RangeId)}
            options={RANGES.map((option) => ({ value: option.id, label: option.label }))}
          />
        </FormField>

        {range === 'custom' && (
          <>
            <FormField label="From" className="w-44">
              <Input
                type="date"
                value={custom.from}
                onChange={(event) => setCustom((c) => ({ ...c, from: event.target.value }))}
              />
            </FormField>
            <FormField label="To" className="w-44">
              <Input
                type="date"
                value={custom.to}
                onChange={(event) => setCustom((c) => ({ ...c, to: event.target.value }))}
              />
            </FormField>
          </>
        )}
      </div>

      {contributions.isLoading ? (
        <SkeletonTable />
      ) : !data ? (
        <EmptyState
          icon={Activity}
          title="Nothing to show"
          description="Contribution figures appear once the team starts making changes."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat icon={Users} label="People" value={data.summary.people} hint="active in this period" />
            <Stat icon={FileText} label="Added" value={data.summary.added} />
            <Stat icon={Activity} label="Updated" value={data.summary.updated} />
            <Stat
              icon={TrendingUp}
              label="Published"
              value={data.summary.published}
              hint={busiestDay ? `busiest day ${busiestDay.date}` : undefined}
            />
          </div>

          <Card flush>
            <CardHeader
              title="Live content"
              subtitle="What exists on the site right now — counted from the content itself, not from the log, because something created and then deleted is not content."
            />
            <CardBody className="flex flex-wrap gap-x-8 gap-y-3">
              {Object.entries(data.summary.live).map(([type, count]) => (
                <div key={type}>
                  <p className="text-lg font-semibold tabular-nums text-slate-900">{count}</p>
                  <p className="text-xs text-slate-500">{TYPE_WORDS[type] ?? type}</p>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card flush>
            <CardHeader title="By person" subtitle="Click a name for their full history." />
            <CardBody className="p-0">
              {data.people.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No activity in this period"
                  description="Try a wider date range."
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-left">
                        <th className="px-4 py-2.5 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                          Person
                        </th>
                        {COLUMNS.map((column) => (
                          <th
                            key={column}
                            className="px-3 py-2.5 text-right text-xs font-semibold tracking-wide text-slate-500 uppercase"
                          >
                            {TYPE_WORDS[column] ?? column}
                          </th>
                        ))}
                        <th className="px-3 py-2.5 text-right text-xs font-semibold tracking-wide text-slate-500 uppercase">
                          Added
                        </th>
                        <th className="px-3 py-2.5 text-right text-xs font-semibold tracking-wide text-slate-500 uppercase">
                          Updated
                        </th>
                        <th className="px-4 py-2.5 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                          Share
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.people.map((person) => (
                        <tr
                          key={person.userId ?? person.userName}
                          className="border-b border-slate-100 last:border-0"
                        >
                          <td className="px-4 py-2.5 font-medium text-slate-800">
                            {person.userId ? (
                              <Link
                                to={`/team-contributions/${person.userId}`}
                                className="text-primary-600 hover:text-primary-700"
                              >
                                {person.userName}
                              </Link>
                            ) : (
                              // The account is gone; the contribution is not.
                              <span title="This account has been removed">
                                {person.userName}
                              </span>
                            )}
                          </td>
                          {COLUMNS.map((column) => (
                            <td
                              key={column}
                              className="px-3 py-2.5 text-right tabular-nums text-slate-600"
                            >
                              {person[column] || '—'}
                            </td>
                          ))}
                          <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-slate-900">
                            {person.added}
                          </td>
                          <td className="px-3 py-2.5 text-right tabular-nums text-slate-600">
                            {person.updated}
                          </td>
                          <td className="px-4 py-2.5">
                            <ShareBar person={person} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardBody>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card flush>
              <CardHeader title="By content type" />
              <CardBody className="space-y-3">
                {data.types.length === 0 ? (
                  <p className="text-sm text-slate-500">Nothing in this period.</p>
                ) : (
                  data.types.map((type) => {
                    const most = Math.max(...data.types.map((t) => t.added), 1)
                    return (
                      <div key={type.entityType} className="flex items-center gap-3">
                        <span className="w-28 shrink-0 text-sm text-slate-600">
                          {TYPE_WORDS[type.entityType] ?? type.entityType}
                        </span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-primary-500"
                            style={{ width: `${(type.added / most) * 100}%` }}
                          />
                        </div>
                        <span className="w-10 text-right text-sm tabular-nums text-slate-700">
                          {type.added}
                        </span>
                      </div>
                    )
                  })
                )}
              </CardBody>
            </Card>

            <Card flush>
              <CardHeader title="Leaderboard" subtitle="By content added in this period." />
              <CardBody className="space-y-2">
                {data.people.slice(0, 8).map((person, index) => (
                  <div
                    key={person.userId ?? person.userName}
                    className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 odd:bg-slate-50"
                  >
                    <span className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="w-6 text-center">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                      </span>
                      {person.userName}
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-slate-900">
                      {person.added}
                    </span>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>

          <Card flush>
            <CardHeader title="Added over time" />
            <CardBody>
              {data.trend.length === 0 ? (
                <p className="text-sm text-slate-500">Nothing in this period.</p>
              ) : (
                <div className="flex h-32 items-end gap-1 overflow-x-auto">
                  {data.trend.map((day) => {
                    const most = Math.max(...data.trend.map((d) => d.added + d.updated), 1)
                    const height = ((day.added + day.updated) / most) * 100
                    return (
                      <div
                        key={day.date}
                        className="flex min-w-[10px] flex-1 flex-col items-center gap-1"
                        title={`${day.date}: ${day.added} added, ${day.updated} updated`}
                      >
                        <div
                          className="w-full rounded-t bg-primary-400"
                          style={{ height: `${Math.max(2, height)}%` }}
                        />
                      </div>
                    )
                  })}
                </div>
              )}
              {data.trend.length > 0 && (
                <p className="mt-2 text-xs text-slate-500">
                  {data.trend[0]!.date} — {data.trend[data.trend.length - 1]!.date}
                </p>
              )}
            </CardBody>
          </Card>

          {data.people.some((person) => person.lastAt) && (
            <p className="text-xs text-slate-500">
              Most recent activity{' '}
              {formatWhen(
                data.people.map((p) => p.lastAt).filter(Boolean).sort().reverse()[0] ?? null,
              )}
              .
            </p>
          )}
        </>
      )}
    </div>
  )
}
