import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown, Globe, Search, Share2 } from 'lucide-react'

import { SITE_URL } from '../../config/siteMap'
import type { SeoFields as SeoValues } from '../../types'
import { FormField } from './FormField'
import { ImageField } from './ImageField'
import { Input } from './Input'
import { TagInput } from './TagInput'
import { Textarea } from './Textarea'

/** Google truncates around these lengths — warn, never block. */
const TITLE_LIMIT = 60
const DESCRIPTION_LIMIT = 160

interface SeoFieldsProps {
  value: SeoValues
  onChange: (value: SeoValues) => void
  /** Used in the search preview, e.g. "giteducation.org/courses/tally-prime". */
  previewUrl: string
  /** Falls back into the preview when no meta title is set. */
  fallbackTitle?: string
  fallbackDescription?: string
  errors?: Partial<Record<'metaTitle' | 'metaDescription', string>>
}

export function SeoFields({
  value,
  onChange,
  previewUrl,
  fallbackTitle,
  fallbackDescription,
  errors,
}: SeoFieldsProps) {
  const patch = (next: Partial<SeoValues>) => onChange({ ...value, ...next })

  const title = value.metaTitle || fallbackTitle || 'Page title'
  const description =
    value.metaDescription || fallbackDescription || 'A short summary shown under the title.'

  const titleLen = (value.metaTitle ?? '').length
  const descLen = (value.metaDescription ?? '').length

  return (
    <Accordion.Root type="single" collapsible className="rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <Accordion.Item value="seo">
        <Accordion.Header>
          <Accordion.Trigger className="group flex w-full items-center justify-between gap-2 px-5 py-4 text-left">
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Search size={15} className="text-slate-400" aria-hidden="true" />
              SEO &amp; Social sharing
            </span>
            <ChevronDown
              size={16}
              className="text-slate-400 transition-transform group-data-[state=open]:rotate-180"
              aria-hidden="true"
            />
          </Accordion.Trigger>
        </Accordion.Header>

        <Accordion.Content className="space-y-5 border-t border-slate-100 px-5 pb-5 pt-4">
          {/* --- Google preview --- */}
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Globe size={12} aria-hidden="true" />
              Google preview
            </p>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="truncate text-xs text-emerald-700">{previewUrl}</p>
              <p className="mt-0.5 truncate text-sm font-medium text-sky-800">{title}</p>
              <p className="mt-0.5 line-clamp-2 text-xs text-slate-600">{description}</p>
            </div>
          </div>

          <FormField
            label="Meta title"
            error={errors?.metaTitle}
            description={
              <span className={titleLen > TITLE_LIMIT ? 'text-amber-600' : undefined}>
                {titleLen} / {TITLE_LIMIT} characters
              </span>
            }
          >
            <Input
              value={value.metaTitle ?? ''}
              onChange={(event) => patch({ metaTitle: event.target.value })}
              placeholder={fallbackTitle}
            />
          </FormField>

          <FormField
            label="Meta description"
            error={errors?.metaDescription}
            description={
              <span className={descLen > DESCRIPTION_LIMIT ? 'text-amber-600' : undefined}>
                {descLen} / {DESCRIPTION_LIMIT} characters
              </span>
            }
          >
            <Textarea
              rows={3}
              value={value.metaDescription ?? ''}
              onChange={(event) => patch({ metaDescription: event.target.value })}
              placeholder={fallbackDescription}
            />
          </FormField>

          <FormField label="Keywords">
            <TagInput
              value={value.keywords ?? []}
              onChange={(keywords) => patch({ keywords })}
              placeholder="Add a keyword…"
              maxTags={10}
            />
          </FormField>

          {/* --- OG Image --- */}
          <FormField
            label={
              <span className="flex items-center gap-1.5">
                <Share2 size={12} aria-hidden="true" />
                Social sharing image
              </span>
            }
            description="Shown when shared on Facebook, Twitter, LinkedIn. Use 1200x630px for best results."
          >
            <ImageField
              value={value.ogImage ?? null}
              onChange={(ogImage) => patch({ ogImage })}
              aspect="wide"
            />
          </FormField>

          <FormField label="Canonical URL" description="Leave blank unless this duplicates another page.">
            <Input
              value={value.canonicalUrl ?? ''}
              onChange={(event) => patch({ canonicalUrl: event.target.value })}
              placeholder={`${SITE_URL}/…`}
            />
          </FormField>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  )
}
