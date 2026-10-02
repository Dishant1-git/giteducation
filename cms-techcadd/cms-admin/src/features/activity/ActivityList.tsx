import { EmptyState } from '../../components/common/EmptyState'
import { History } from 'lucide-react'

import type { ActivityEntry } from '../../api/resources/activity'
import { ACTION_WORDS, formatWhen, TYPE_WORDS } from './dateRanges'

/** Tone per action, so a deletion is not the same colour as a save. */
const TONES: Record<string, string> = {
  created: 'bg-emerald-50 text-emerald-700',
  published: 'bg-primary-50 text-primary-700',
  updated: 'bg-slate-100 text-slate-600',
  unpublished: 'bg-amber-50 text-amber-700',
  deleted: 'bg-rose-50 text-rose-700',
  approved: 'bg-emerald-50 text-emerald-700',
  hidden: 'bg-amber-50 text-amber-700',
}

/**
 * The history, read as sentences.
 *
 * "Sandeep added Blog: Introduction to AI" rather than a row of columns —
 * this is the view people scan to answer "what happened", and a sentence is
 * faster to scan than a table when every row has the same shape.
 *
 * The label is whatever the thing was called when it happened, which is why it
 * is stored on the log rather than joined: a blog renamed last week should not
 * rewrite what the history says about it.
 */
export function ActivityList({
  entries,
  showPerson = true,
}: {
  entries: ActivityEntry[]
  showPerson?: boolean
}) {
  if (entries.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="Nothing recorded"
        description="Actions appear here as the team works."
      />
    )
  }

  return (
    <ol className="divide-y divide-slate-100">
      {entries.map((entry) => {
        const count = (entry.metadata as { count?: number } | null)?.count
        return (
          <li key={entry.id} className="flex flex-wrap items-baseline gap-x-2 gap-y-1 px-4 py-3">
            <span className="w-40 shrink-0 text-xs tabular-nums text-slate-400">
              {formatWhen(entry.createdAt)}
            </span>

            {showPerson && (
              <span className="font-medium text-slate-800">{entry.userName}</span>
            )}

            <span
              className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${
                TONES[entry.action] ?? 'bg-slate-100 text-slate-600'
              }`}
            >
              {ACTION_WORDS[entry.action] ?? entry.action}
            </span>

            <span className="text-sm text-slate-600">
              {TYPE_WORDS[entry.entityType] ?? entry.entityType}
              {/* A bulk action is one row with a count, not a fake singular. */}
              {count && count > 1 ? (
                <span className="text-slate-500"> ×{count}</span>
              ) : entry.entityLabel ? (
                <>
                  : <span className="text-slate-800">{entry.entityLabel}</span>
                </>
              ) : null}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
