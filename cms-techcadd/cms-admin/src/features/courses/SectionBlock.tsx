import type { ReactNode } from 'react'

/**
 * One page section's worth of fields, grouped under a heading.
 *
 * The page-copy tab now carries eight repeatable sections on top of the flat
 * fields, and without a visible boundary between them the form reads as one
 * long undifferentiated column — an editor scrolling for "career outcomes" has
 * nothing to aim at. A heading and a rule are enough; anything heavier competes
 * with the cards the tab is already divided into.
 */
export function SectionBlock({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="space-y-4 border-t border-slate-200 pt-5">
      <div>
        <h3 className="text-sm font-semibold text-slate-800">{label}</h3>
        {description && <p className="mt-0.5 text-[13px] text-slate-500">{description}</p>}
      </div>
      {children}
    </section>
  )
}
