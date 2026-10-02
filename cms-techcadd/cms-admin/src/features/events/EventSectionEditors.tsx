import { ImagePlus, ListChecks, Plus, Trash2, UserPlus } from 'lucide-react'

import { Button } from '../../components/common/Button'
import { EmptyState } from '../../components/common/EmptyState'
import { SortableList } from '../../components/data/SortableList'
import { FormField } from '../../components/form/FormField'
import { ImageField } from '../../components/form/ImageField'
import { Input } from '../../components/form/Input'
import { Textarea } from '../../components/form/Textarea'
import { createId } from '../../lib/id'
import type {
  AgendaItemValues,
  EventPhotoValues,
  HighlightValues,
  SpeakerValues,
} from './eventSchema'

/*
  The four repeatable parts of an event.

  Kept in one file rather than four because they are the same component with
  different fields, and splitting them would mean four copies of the add /
  patch / remove / reorder trio drifting apart. Each one is ordered by its
  position in the array — `order` is written from the index on save, so
  dragging a row is the whole of reordering.

  Every list is allowed to be empty. An event with no speakers listed is an
  ordinary event, not an unfinished one, and the website simply omits the
  section — which is why each empty state describes what will happen rather
  than nagging for a first entry.
*/

/** Row ids are local until saved. `createId` prefixes them; the server
 *  replaces anything that is not already a plain UUID. */
function withOrder<T extends { order: number }>(rows: T[]): T[] {
  return rows.map((row, index) => ({ ...row, order: index }))
}

/* ------------------------------------------------------------------ */

interface HighlightsProps {
  value: HighlightValues[]
  onChange: (value: HighlightValues[]) => void
}

/** "What you'll take away" — the bullets above the fold on the event page. */
export function HighlightsEditor({ value, onChange }: HighlightsProps) {
  const rows = value.map((row) => ({ ...row, id: row.id ?? createId('highlight') }))

  return (
    <div className="space-y-3">
      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200">
          <EmptyState
            icon={ListChecks}
            title="No takeaways listed"
            description="Add a few and they appear as a checklist near the top of the event page. Leave it empty and that section is left out."
          />
        </div>
      ) : (
        <SortableList
          items={rows}
          getId={(row) => row.id!}
          onReorder={(next) => onChange(withOrder(next))}
          renderItem={(row, index) => (
            <div className="flex items-start gap-2">
              <span className="mt-2 text-xs font-semibold text-slate-400">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <FormField label={`Takeaway ${index + 1}`} hideLabel>
                  <Input
                    value={row.text}
                    onChange={(event) =>
                      onChange(
                        withOrder(
                          rows.map((entry) =>
                            entry.id === row.id ? { ...entry, text: event.target.value } : entry,
                          ),
                        ),
                      )
                    }
                    placeholder="Build and ship a working agent with LangChain"
                    maxLength={240}
                    aria-label={`Takeaway ${index + 1}`}
                  />
                </FormField>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon={Trash2}
                aria-label={`Remove takeaway ${index + 1}`}
                className="mt-0.5 text-rose-600 hover:bg-rose-50"
                onClick={() => onChange(withOrder(rows.filter((entry) => entry.id !== row.id)))}
              />
            </div>
          )}
        />
      )}

      <Button
        variant="secondary"
        size="sm"
        icon={Plus}
        onClick={() => onChange(withOrder([...rows, { id: createId('highlight'), text: '', order: rows.length }]))}
      >
        Add takeaway
      </Button>
    </div>
  )
}

/* ------------------------------------------------------------------ */

interface AgendaProps {
  value: AgendaItemValues[]
  onChange: (value: AgendaItemValues[]) => void
}

/** The running order — one row per session. */
export function AgendaEditor({ value, onChange }: AgendaProps) {
  const rows = value.map((row) => ({ ...row, id: row.id ?? createId('agenda') }))

  function patch(id: string, next: Partial<AgendaItemValues>) {
    onChange(withOrder(rows.map((row) => (row.id === id ? { ...row, ...next } : row))))
  }

  return (
    <div className="space-y-3">
      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200">
          <EmptyState
            icon={ListChecks}
            title="No schedule yet"
            description="Add sessions to print a running order on the page. A one-hour talk usually needs none."
          />
        </div>
      ) : (
        <SortableList
          items={rows}
          getId={(row) => row.id!}
          onReorder={(next) => onChange(withOrder(next))}
          renderItem={(row, index) => (
            <div className="flex items-start gap-2">
              <span className="mt-2 text-xs font-semibold text-slate-400">
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="min-w-0 flex-1 space-y-3">
                {/* Time beside title on a wide screen, stacked below `sm` —
                    two inputs and a delete button across a phone leaves each
                    of them narrower than the text they hold. */}
                <div className="grid gap-3 sm:grid-cols-[9rem_1fr]">
                  <FormField label={`Session ${index + 1} time`} hideLabel>
                    <Input
                      value={row.timeLabel ?? ''}
                      onChange={(event) => patch(row.id!, { timeLabel: event.target.value })}
                      placeholder="10:00 – 11:30"
                      maxLength={60}
                      aria-label={`Session ${index + 1} time`}
                    />
                  </FormField>

                  <FormField label={`Session ${index + 1} title`} hideLabel>
                    <Input
                      value={row.title}
                      onChange={(event) => patch(row.id!, { title: event.target.value })}
                      placeholder="What an agent actually is"
                      maxLength={200}
                      aria-label={`Session ${index + 1} title`}
                    />
                  </FormField>
                </div>

                <FormField label={`Session ${index + 1} detail`} hideLabel>
                  <Textarea
                    value={row.detail ?? ''}
                    onChange={(event) => patch(row.id!, { detail: event.target.value })}
                    rows={2}
                    maxLength={600}
                    placeholder="Optional — a line on what is covered."
                    aria-label={`Session ${index + 1} detail`}
                  />
                </FormField>
              </div>

              <Button
                variant="ghost"
                size="sm"
                icon={Trash2}
                aria-label={`Remove session ${index + 1}`}
                className="mt-0.5 text-rose-600 hover:bg-rose-50"
                onClick={() => onChange(withOrder(rows.filter((entry) => entry.id !== row.id)))}
              />
            </div>
          )}
        />
      )}

      <Button
        variant="secondary"
        size="sm"
        icon={Plus}
        onClick={() =>
          onChange(
            withOrder([...rows, { id: createId('agenda'), title: '', timeLabel: '', detail: '', order: rows.length }]),
          )
        }
      >
        Add session
      </Button>
    </div>
  )
}

/* ------------------------------------------------------------------ */

interface SpeakersProps {
  value: SpeakerValues[]
  onChange: (value: SpeakerValues[]) => void
}

/** Who is speaking, with a photograph each. */
export function SpeakersEditor({ value, onChange }: SpeakersProps) {
  const rows = value.map((row) => ({ ...row, id: row.id ?? createId('speaker') }))

  function patch(id: string, next: Partial<SpeakerValues>) {
    onChange(withOrder(rows.map((row) => (row.id === id ? { ...row, ...next } : row))))
  }

  return (
    <div className="space-y-3">
      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200">
          <EmptyState
            icon={UserPlus}
            title="No speakers listed"
            description="Add the trainers or guests taking the session. With none, the page leaves the section out."
          />
        </div>
      ) : (
        <SortableList
          items={rows}
          getId={(row) => row.id!}
          onReorder={(next) => onChange(withOrder(next))}
          renderItem={(row, index) => (
            <div className="flex items-start gap-3">
              <div className="w-24 shrink-0">
                <ImageField
                  value={row.photo}
                  onChange={(photo) => patch(row.id!, { photo })}
                  aspect="square"
                />
              </div>

              <div className="min-w-0 flex-1 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField label={`Speaker ${index + 1} name`} hideLabel>
                    <Input
                      value={row.name}
                      onChange={(event) => patch(row.id!, { name: event.target.value })}
                      placeholder="Full name"
                      maxLength={120}
                      aria-label={`Speaker ${index + 1} name`}
                    />
                  </FormField>

                  <FormField label={`Speaker ${index + 1} role`} hideLabel>
                    <Input
                      value={row.role ?? ''}
                      onChange={(event) => patch(row.id!, { role: event.target.value })}
                      placeholder="Senior AI Engineer"
                      maxLength={160}
                      aria-label={`Speaker ${index + 1} role`}
                    />
                  </FormField>
                </div>

                <FormField label={`Speaker ${index + 1} organisation`} hideLabel>
                  <Input
                    value={row.org ?? ''}
                    onChange={(event) => patch(row.id!, { org: event.target.value })}
                    placeholder="Organisation"
                    maxLength={160}
                    aria-label={`Speaker ${index + 1} organisation`}
                  />
                </FormField>

                <FormField label={`Speaker ${index + 1} bio`} hideLabel>
                  <Textarea
                    value={row.bio ?? ''}
                    onChange={(event) => patch(row.id!, { bio: event.target.value })}
                    rows={2}
                    maxLength={600}
                    placeholder="Optional — a couple of lines."
                    aria-label={`Speaker ${index + 1} bio`}
                  />
                </FormField>
              </div>

              <Button
                variant="ghost"
                size="sm"
                icon={Trash2}
                aria-label={`Remove speaker ${index + 1}`}
                className="mt-0.5 text-rose-600 hover:bg-rose-50"
                onClick={() => onChange(withOrder(rows.filter((entry) => entry.id !== row.id)))}
              />
            </div>
          )}
        />
      )}

      <Button
        variant="secondary"
        size="sm"
        icon={Plus}
        onClick={() =>
          onChange(
            withOrder([
              ...rows,
              { id: createId('speaker'), name: '', role: '', org: '', bio: '', photo: undefined, order: rows.length },
            ]),
          )
        }
      >
        Add speaker
      </Button>
    </div>
  )
}

/* ------------------------------------------------------------------ */

interface PhotosProps {
  value: EventPhotoValues[]
  onChange: (value: EventPhotoValues[]) => void
}

/**
 * Photographs from the day.
 *
 * For an event that has already happened — the page shows this strip below the
 * write-up, so a seminar keeps its own record instead of it being scattered
 * into the site-wide gallery with nothing tying it back.
 */
export function EventPhotosEditor({ value, onChange }: PhotosProps) {
  const rows = value.map((row) => ({ ...row, id: row.id ?? createId('photo') }))

  function patch(id: string, next: Partial<EventPhotoValues>) {
    onChange(withOrder(rows.map((row) => (row.id === id ? { ...row, ...next } : row))))
  }

  return (
    <div className="space-y-3">
      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200">
          <EmptyState
            icon={ImagePlus}
            title="No photographs yet"
            description="Add them after the event and they appear as a strip at the foot of its page."
          />
        </div>
      ) : (
        <SortableList
          items={rows}
          getId={(row) => row.id!}
          onReorder={(next) => onChange(withOrder(next))}
          renderItem={(row, index) => (
            <div className="flex items-start gap-3">
              <div className="w-32 shrink-0">
                <ImageField
                  value={row.media}
                  /* The media slot is required on a photo row, so clearing it
                     removes the row rather than leaving one with no image. */
                  onChange={(media) => {
                    if (media) patch(row.id!, { media })
                    else onChange(withOrder(rows.filter((entry) => entry.id !== row.id)))
                  }}
                  aspect="video"
                />
              </div>

              <div className="min-w-0 flex-1">
                <FormField label={`Photo ${index + 1} caption`} hideLabel>
                  <Input
                    value={row.caption ?? ''}
                    onChange={(event) => patch(row.id!, { caption: event.target.value })}
                    placeholder="Optional caption"
                    maxLength={240}
                    aria-label={`Photo ${index + 1} caption`}
                  />
                </FormField>
              </div>

              <Button
                variant="ghost"
                size="sm"
                icon={Trash2}
                aria-label={`Remove photo ${index + 1}`}
                className="mt-0.5 text-rose-600 hover:bg-rose-50"
                onClick={() => onChange(withOrder(rows.filter((entry) => entry.id !== row.id)))}
              />
            </div>
          )}
        />
      )}

      <AddPhoto onAdd={(media) => onChange(withOrder([...rows, { id: createId('photo'), media, caption: '', order: rows.length }]))} />
    </div>
  )
}

/**
 * A bare image slot that turns into a row the moment something is picked.
 *
 * Adding an empty row and then filling it would leave a row with no image if
 * the editor changed their mind — and a photo row with no photo is the one
 * shape the list is not allowed to hold.
 */
function AddPhoto({ onAdd }: { onAdd: (media: NonNullable<EventPhotoValues['media']>) => void }) {
  return (
    <div className="w-32">
      <ImageField
        value={undefined}
        onChange={(media) => {
          if (media) onAdd(media)
        }}
        aspect="video"
      />
    </div>
  )
}
