import { Plus, Trash2 } from 'lucide-react'

import { Button } from '../../components/common/Button'
import { SortableList } from '../../components/data/SortableList'
import { EmptyState } from '../../components/common/EmptyState'
import { FormField } from '../../components/form/FormField'
import { ImageField } from '../../components/form/ImageField'
import { Input } from '../../components/form/Input'
import { NumberInput } from '../../components/form/NumberInput'
import { Select } from '../../components/form/Select'
import { TagInput } from '../../components/form/TagInput'
import { Textarea } from '../../components/form/Textarea'
import { createId } from '../../lib/id'
import type { SyllabusModule } from '../../types'

interface SyllabusEditorProps {
  value: SyllabusModule[]
  onChange: (value: SyllabusModule[]) => void
  /** The course's plans, for the "starts from" select. Empty hides it. */
  plans?: { id: string; label: string }[]
  /**
   * The validation message for one module's title, if the form has flagged
   * it. Title is the only field here with a rule to fail — without this a
   * module can block the save with nothing on screen pointing at it.
   */
  getError?: (index: number) => string | undefined
}

export function SyllabusEditor({ value, onChange, plans = [], getError }: SyllabusEditorProps) {
  /**
   * Which plan a module starts from.
   *
   * The list is nested: a module included from plan 2 is in plan 2 and every
   * longer one. That is why this is one choice rather than a tick per plan —
   * a shorter plan covering something a longer one skipped cannot be drawn
   * honestly in a comparison table, so the form does not allow expressing it.
   */
  const planOptions = [
    { value: '', label: 'Every plan' },
    ...plans.map((plan, index) => ({
      value: String(index + 1),
      label: `From ${plan.label || `plan ${index + 1}`}`,
    })),
  ]
  function patch(id: string, next: Partial<SyllabusModule>) {
    onChange(value.map((module) => (module.id === id ? { ...module, ...next } : module)))
  }

  function add() {
    onChange([
      ...value,
      {
        id: createId('mod'),
        title: '',
        topics: [],
        body: '',
        outcomes: [],
        tools: [],
        project: '',
        fromPlan: '',
      },
    ])
  }

  return (
    <div className="space-y-3">
      {value.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200">
          <EmptyState
            icon={Plus}
            title="No modules yet"
            description="Break the course into modules so the syllabus reads clearly on the website."
          />
        </div>
      ) : (
        <SortableList
          items={value}
          getId={(module) => module.id}
          onReorder={onChange}
          renderItem={(module, index) => (
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="mt-2 text-xs font-semibold text-slate-400">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="min-w-0 flex-1">
                  <FormField label={`Module ${index + 1} title`} hideLabel error={getError?.(index)}>
                    <Input
                      value={module.title}
                      onChange={(event) => patch(module.id, { title: event.target.value })}
                      placeholder="Module title"
                      aria-label={`Module ${index + 1} title`}
                    />
                  </FormField>
                </div>

                <div className="w-28 shrink-0">
                  <NumberInput
                    value={module.hours ?? ''}
                    onChange={(hours) =>
                      patch(module.id, { hours: hours === '' ? undefined : hours })
                    }
                    min={0}
                    suffix="hrs"
                  />
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  aria-label={`Remove module ${index + 1}`}
                  className="mt-0.5 text-rose-600 hover:bg-rose-50"
                  onClick={() => onChange(value.filter((entry) => entry.id !== module.id))}
                />
              </div>

              <div className="space-y-3 pl-6">
                <TagInput
                  value={module.topics}
                  onChange={(topics) => patch(module.id, { topics })}
                  placeholder="Add a topic and press Enter…"
                />

                <Textarea
                  value={module.body ?? ''}
                  onChange={(event) => patch(module.id, { body: event.target.value })}
                  rows={2}
                  placeholder="What this module covers, in a sentence…"
                  aria-label={`Module ${index + 1} description`}
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    value={module.project ?? ''}
                    onChange={(event) => patch(module.id, { project: event.target.value })}
                    placeholder="What they build in it…"
                    aria-label={`Module ${index + 1} project`}
                  />

                  {plans.length > 0 && (
                    <Select
                      value={module.fromPlan ?? ''}
                      onChange={(event) => patch(module.id, { fromPlan: event.target.value })}
                      options={planOptions}
                      aria-label={`Module ${index + 1} starts from`}
                    />
                  )}
                </div>

                {/*
                  An optional picture for this module.

                  The id is what the API stores and has accepted since these
                  were first modelled; the record itself is kept beside it so
                  the preview has an address to draw. Set and cleared together,
                  so the two can never disagree.
                */}
                <FormField
                  label={`Module ${index + 1} image`}
                  hideLabel
                  description="Image for this module."
                >
                  <ImageField
                    value={module.media ?? undefined}
                    onChange={(media) =>
                      patch(module.id, { media, mediaId: media?.id ?? undefined })
                    }
                    aspect="video"
                  />
                </FormField>
              </div>
            </div>
          )}
        />
      )}

      <Button variant="secondary" size="sm" icon={Plus} onClick={add}>
        Add module
      </Button>
    </div>
  )
}
