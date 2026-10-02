import { useId, type ReactNode } from 'react'

import { cn } from '../../lib/cn'
import { FieldContext } from './field'

interface FormFieldProps {
  /** Rendered inside the <label>, so a node is fine — the SEO fields pair an icon with the text. */
  label: ReactNode
  children: ReactNode
  required?: boolean
  /**
   * Usually a sentence, but a node so a field can hang live feedback here —
   * the SEO fields put a character count in it that turns amber past the limit.
   */
  description?: ReactNode
  error?: string
  /** Hides the label visually while keeping it for screen readers. */
  hideLabel?: boolean
  className?: string
}

export function FormField({
  label,
  children,
  required = false,
  description,
  error,
  hideLabel = false,
  className,
}: FormFieldProps) {
  const id = useId()
  const descriptionId = `${id}-description`
  const errorId = `${id}-error`

  const describedBy =
    [description ? descriptionId : null, error ? errorId : null].filter(Boolean).join(' ') ||
    undefined

  return (
    <FieldContext.Provider value={{ id, describedBy, invalid: Boolean(error) }}>
      <div className={cn('min-w-0', className)}>
        <label htmlFor={id} className={cn('block text-sm font-medium text-slate-700', hideLabel && 'sr-only')}>
          {label}
          {required && (
            <span className="ml-0.5 text-rose-600" aria-hidden="true">
              *
            </span>
          )}
        </label>

        {description && (
          <p id={descriptionId} className="mt-0.5 text-xs text-slate-500">
            {description}
          </p>
        )}

        <div className={cn(!hideLabel && 'mt-1.5')}>{children}</div>

        {error && (
          <p id={errorId} role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
            {error}
          </p>
        )}
      </div>
    </FieldContext.Provider>
  )
}
