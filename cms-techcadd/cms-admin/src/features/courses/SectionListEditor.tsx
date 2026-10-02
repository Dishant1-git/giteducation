import { Plus, Trash2 } from 'lucide-react'

import { Button } from '../../components/common/Button'
import { SortableList } from '../../components/data/SortableList'
import { EmptyState } from '../../components/common/EmptyState'
import { FormField } from '../../components/form/FormField'
import { ImageField } from '../../components/form/ImageField'
import { Input } from '../../components/form/Input'
import { Select } from '../../components/form/Select'
import { TagInput } from '../../components/form/TagInput'
import { Textarea } from '../../components/form/Textarea'
import { createId } from '../../lib/id'
import type { MediaRef } from '../../types'

/** One editable field on a row. */
export interface SectionField<T> {
  key: keyof T & string
  label: string
  placeholder?: string
  kind?: 'text' | 'textarea' | 'tags' | 'select' | 'image'
  /**
   * 'image' only: the field that stores the chosen file's id.
   *
   * The picker works in whole media records so it can draw a preview, but the
   * API stores an id — so the two are kept as separate keys on the row and
   * written together. `key` holds the record, this holds the id.
   */
  idKey?: keyof T & string
  options?: { value: string; label: string }[]
  /** Narrow fields sit beside the wide one rather than under it. */
  width?: 'full' | 'half' | 'narrow'
}

interface SectionListEditorProps<T> {
  value: T[]
  onChange: (value: T[]) => void
  fields: SectionField<T>[]
  /** A fresh row. The caller supplies defaults so required enums start valid. */
  blank: () => Omit<T, 'id'>
  emptyTitle: string
  emptyDescription: string
  addLabel: string
  /** Shown as the row's number. Off for lists the page does not number. */
  numbered?: boolean
  /**
   * The validation message for one row's field, if the form has flagged it.
   *
   * Without this a row can fail to save for a reason nothing on screen names —
   * the save banner points at the section, not the field, because this editor
   * never asked react-hook-form what was wrong. Optional so a caller that
   * has not wired its errors through yet still renders.
   */
  getError?: (index: number, key: keyof T) => string | undefined
}

/**
 * The repeatable sections of a course, over one component.
 *
 * Eight sections differ only in which fields a row carries — audience, what you
 * get, careers, projects, workflow, why us, comparison rows, tools. Written out
 * eight times they would drift eight ways: one would forget the empty state,
 * another the drag handle, another would number from zero. Configured once,
 * they cannot.
 *
 * Empty is a real answer everywhere this is used: with no rows the website
 * prints the copy its generator produces, so the empty state says which, rather
 * than implying the section is broken.
 */
export function SectionListEditor<T extends { id: string }>({
  value,
  onChange,
  fields,
  blank,
  emptyTitle,
  emptyDescription,
  addLabel,
  numbered = true,
  getError,
}: SectionListEditorProps<T>) {
  function patch(id: string, next: Partial<T>) {
    onChange(value.map((row) => (row.id === id ? { ...row, ...next } : row)))
  }

  function add() {
    onChange([...value, { ...blank(), id: createId('row') } as T])
  }

  function control(row: T, field: SectionField<T>, index: number) {
    const current = (row[field.key] ?? '') as string & string[]
    const aria = `${field.label}, row ${index + 1}`

    if (field.kind === 'textarea') {
      return (
        <Textarea
          value={current as string}
          onChange={(event) => patch(row.id, { [field.key]: event.target.value } as Partial<T>)}
          rows={2}
          placeholder={field.placeholder}
          aria-label={aria}
        />
      )
    }

    if (field.kind === 'image') {
      /*
        Optional everywhere it is offered, so there is no empty state to
        design: ImageField already shows a picker when there is nothing and a
        preview with replace and remove when there is. Choosing sets both keys
        and removing clears both, so the id the API stores can never disagree
        with the file the editor is looking at.
      */
      return (
        <ImageField
          /* `current` is typed from the row's text fields; a media row is an
             object, so this crosses through `unknown` rather than pretending
             the two overlap. */
          value={(current as unknown as MediaRef | undefined) ?? undefined}
          onChange={(media) =>
            patch(row.id, {
              [field.key]: media,
              ...(field.idKey ? { [field.idKey]: media?.id ?? undefined } : {}),
            } as Partial<T>)
          }
          aspect="video"
        />
      )
    }

    if (field.kind === 'tags') {
      return (
        <TagInput
          value={(current as string[]) ?? []}
          onChange={(tags) => patch(row.id, { [field.key]: tags } as Partial<T>)}
          placeholder={field.placeholder ?? 'Add and press Enter…'}
        />
      )
    }

    if (field.kind === 'select') {
      return (
        <Select
          value={current as string}
          onChange={(event) => patch(row.id, { [field.key]: event.target.value } as Partial<T>)}
          options={field.options ?? []}
          aria-label={aria}
        />
      )
    }

    return (
      <Input
        value={current as string}
        onChange={(event) => patch(row.id, { [field.key]: event.target.value } as Partial<T>)}
        placeholder={field.placeholder}
        aria-label={aria}
      />
    )
  }

  return (
    <div className="space-y-3">
      {value.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200">
          <EmptyState icon={Plus} title={emptyTitle} description={emptyDescription} />
        </div>
      ) : (
        <SortableList
          items={value}
          getId={(row) => row.id}
          onReorder={onChange}
          renderItem={(row, index) => (
            <div className="flex items-start gap-2">
              {numbered && (
                <span className="mt-2 text-xs font-semibold text-slate-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
              )}

              <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2">
                {fields.map((field) => (
                  <div
                    key={field.key}
                    className={
                      field.width === 'narrow'
                        ? 'sm:col-span-1'
                        : field.width === 'half'
                          ? 'sm:col-span-1'
                          : 'sm:col-span-2'
                    }
                  >
                    <FormField label={field.label} hideLabel error={getError?.(index, field.key)}>
                      {control(row, field, index)}
                    </FormField>
                  </div>
                ))}
              </div>

              <Button
                variant="ghost"
                size="sm"
                icon={Trash2}
                aria-label={`Remove row ${index + 1}`}
                className="mt-0.5 text-rose-600 hover:bg-rose-50"
                onClick={() => onChange(value.filter((entry) => entry.id !== row.id))}
              />
            </div>
          )}
        />
      )}

      <Button variant="secondary" size="sm" icon={Plus} onClick={add}>
        {addLabel}
      </Button>
    </div>
  )
}
