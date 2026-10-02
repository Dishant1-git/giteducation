import { useWatch, type Control, type UseFormRegister } from 'react-hook-form'

import { FormField } from '../../components/form/FormField'
import { Input } from '../../components/form/Input'
import { Select } from '../../components/form/Select'
import type { CourseFormValues } from './courseSchema'

/** What each button does. The two navigating types are the only ones with an address. */
const CTA_TYPES = [
  { value: 'enquiry', label: 'Open the enquiry form' },
  { value: 'contact', label: 'Go to the contact page' },
  { value: 'internal', label: 'Go to another page on this site' },
  { value: 'external', label: 'Go to another website' },
]

type CtaName = 'ctaPrimary' | 'ctaSecondary'

interface CtaFieldsProps {
  legend: string
  name: CtaName
  control: Control<CourseFormValues>
  register: UseFormRegister<CourseFormValues>
  errors?: { text?: { message?: string }; type?: { message?: string }; url?: { message?: string } }
  /** What the website shows when the label is left blank. */
  fallback: string
}

/**
 * One hero button.
 *
 * The address field appears only for the two types that navigate somewhere the
 * editor chooses — asking for a URL beside "open the enquiry form" invites one
 * to be filled in and then quietly ignored.
 */
export function CtaFields({ legend, name, control, register, errors, fallback }: CtaFieldsProps) {
  const type = useWatch({ control, name: `${name}.type` })
  const needsUrl = type === 'internal' || type === 'external'

  return (
    <fieldset className="space-y-4 rounded-lg border border-slate-200 p-4">
      <legend className="px-1 text-xs font-semibold tracking-wide text-slate-500 uppercase">
        {legend}
      </legend>

      <FormField
        label="Button text"
        description={`Blank shows “${fallback}”.`}
        error={errors?.text?.message}
      >
        <Input {...register(`${name}.text`)} placeholder={fallback} />
      </FormField>

      <FormField label="What it does" error={errors?.type?.message}>
        <Select {...register(`${name}.type`)} options={CTA_TYPES} />
      </FormField>

      {needsUrl && (
        <FormField
          label="Link"
          description={
            type === 'internal'
              ? 'A path on this site, beginning with “/”.'
              : 'A full https:// address.'
          }
          error={errors?.url?.message}
        >
          <Input
            {...register(`${name}.url`)}
            placeholder={type === 'internal' ? '/courses' : 'https://example.com'}
          />
        </FormField>
      )}
    </fieldset>
  )
}
