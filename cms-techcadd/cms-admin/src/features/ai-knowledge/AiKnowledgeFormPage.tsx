import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { LinkIcon, Plus, Trash2 } from 'lucide-react'
import { z } from 'zod'

import { ApiError } from '../../api'
import { Button } from '../../components/common/Button'
import { Card, CardBody, CardHeader } from '../../components/common/Card'
import { Alert } from '../../components/feedback/Alert'
import { Spinner } from '../../components/feedback/Spinner'
import { FormField } from '../../components/form/FormField'
import { Input } from '../../components/form/Input'
import { Select } from '../../components/form/Select'
import { Textarea } from '../../components/form/Textarea'
import { FormFooter } from '../../components/layout/FormFooter'
import { PageHeader } from '../../components/layout/PageHeader'
import { useToast } from '../../hooks/useToast'
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges'
import { STATUS_OPTIONS } from '../courses/courseSchema'
import type { AiKnowledgeFormValues } from './aiKnowledgeSchema'
import { aiKnowledgeHooks } from './useAiKnowledge'

/**
 * Form-level schema: links are objects `{ value: string }` so useFieldArray
 * can track each row by id. Converted to flat `string[]` before submit.
 */
const formSchema = z.object({
  title: z.string().min(1, 'A title is required.').max(200),
  content: z.string().min(1, 'Content is required.'),
  links: z.array(z.object({ value: z.string().url('Enter a valid URL.') })),
  category: z.string().min(1, 'Choose a category.').max(80),
  order: z.number(),
  status: z.enum(['published', 'draft', 'review']),
})

type FormValues = z.infer<typeof formSchema>

function toFormValues(v: AiKnowledgeFormValues): FormValues {
  return { ...v, links: (v.links ?? []).map((url) => ({ value: url })) }
}

function emptyForm(): FormValues {
  return {
    title: '',
    content: '',
    links: [],
    category: 'General',
    order: 0,
    status: 'draft',
  }
}

export default function AiKnowledgeFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const toast = useToast()

  const existing = aiKnowledgeHooks.useOne(id)
  const create = aiKnowledgeHooks.useCreate()
  const update = aiKnowledgeHooks.useUpdate()

  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: emptyForm(),
    mode: 'onBlur',
  })

  const { fields, append, remove: removeField } = useFieldArray({ control, name: 'links' })

  useEffect(() => {
    if (existing.data) reset(toFormValues(existing.data as AiKnowledgeFormValues))
  }, [existing.data, reset])

  const blocker = useUnsavedChanges(isDirty && !isSubmitting)

  /*
    Back to the last saved values.

    `reset()` with no argument restores whatever was last committed to the
    form — which is exactly what each of these pages resets to when the record
    loads. So this returns the editor to the saved version without another
    fetch, and touches nothing in the database.
  */
  const discard = () => reset()
  const saving = create.isPending || update.isPending

  async function onSubmit(values: FormValues) {
    const payload: AiKnowledgeFormValues = {
      ...values,
      links: values.links.map((l) => l.value).filter(Boolean),
    }
    try {
      if (isEdit && id) {
        await update.mutateAsync({ id, input: payload })
        toast.success('Entry updated.')
      } else {
        await create.mutateAsync(payload)
        toast.success('Entry created.')
      }
      navigate('/ai-knowledge')
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        for (const [field, message] of Object.entries(error.fieldErrors)) {
          setError(field as keyof FormValues, { message })
        }
        toast.error('Please fix the highlighted fields.')
        return
      }
      toast.error('Could not save this entry', {
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    }
  }

  if (isEdit && existing.isLoading) {
    return (
      <div className="flex items-center gap-2 p-8 text-sm text-slate-500">
        <Spinner />
        Loading entry…
      </div>
    )
  }

  if (isEdit && existing.error) {
    return (
      <Alert tone="error" title="Could not load this entry">
        <p>{(existing.error as Error).message}</p>
        <Link to="/ai-knowledge" className="mt-3 inline-block">
          <Button variant="secondary" size="sm">
            Back to knowledge base
          </Button>
        </Link>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-24">
      <PageHeader
        title={isEdit ? 'Edit Knowledge Entry' : 'New Knowledge Entry'}
        breadcrumb={[
          { label: 'AI Knowledge', to: '/ai-knowledge' },
          { label: isEdit ? 'Edit' : 'New' },
        ]}
      />

      {Object.keys(errors).length > 0 && (
        <Alert tone="error" title="This entry could not be saved">
          Check the highlighted fields below and try again.
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card flush>
            <CardHeader
              title="Knowledge Content"
              subtitle="Write knowledge like a book — the website assistant will read this text and answer visitor questions from it."
            />
            <CardBody className="space-y-5">
              <FormField label="Title / Topic" required error={errors.title?.message}>
                <Input
                  {...register('title')}
                  placeholder="e.g. About GIT Education, Fee Structure, Placement Details"
                />
              </FormField>

              <FormField
                label="Knowledge text"
                required
                error={errors.content?.message}
                description="Write everything the assistant should know about this topic. Write freely like a book — paragraphs, bullet points, details. The AI reads this and finds relevant answers automatically."
              >
                <Textarea
                  {...register('content')}
                  rows={25}
                  className="min-h-[400px] font-mono text-sm leading-relaxed"
                  placeholder={`Write detailed knowledge here. Example:\n\nGIT Education was founded in 2016 in Jalandhar, Punjab. We offer professional courses in IT, design, and engineering software.\n\nOur admission process:\n- Visit the institute or call us\n- Choose your preferred course\n- Pay the registration fee\n- Get your batch schedule\n\nFee structure:\n- AutoCAD: ₹15,000 (3 months)\n- Web Development: ₹25,000 (6 months)\n- Graphic Design: ₹20,000 (4 months)\n\nAll fees include study material and certification. EMI options available.\n\nPlacement support:\n- 100% placement assistance\n- Resume building and interview preparation\n- Direct tie-ups with companies\n- Average package: ₹3-5 LPA for freshers`}
                />
              </FormField>
            </CardBody>
          </Card>

          <Card flush>
            <CardHeader
              title="Reference Links"
              subtitle="Add pages the assistant can point visitors to for more detail. The assistant shares these links; it does not read the pages, so put the facts themselves in the text above."
            />
            <CardBody className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <div className="mt-2.5 text-slate-400">
                    <LinkIcon size={16} />
                  </div>
                  <div className="flex-1">
                    <Input
                      {...register(`links.${index}.value`)}
                      type="url"
                      placeholder="https://example.com/page-to-read"
                    />
                    {errors.links?.[index]?.value && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.links[index]?.value?.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-1 text-red-500 hover:text-red-700"
                    onClick={() => removeField(index)}
                    aria-label="Remove link"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon={Plus}
                onClick={() => append({ value: '' })}
              >
                Add link
              </Button>

              {fields.length === 0 && (
                <p className="text-sm text-slate-400">
                  No reference links yet. Add URLs and the AI will read content from those pages to
                  enhance its answers.
                </p>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card flush>
            <CardHeader title="Settings" />
            <CardBody className="space-y-5">
              <FormField label="Status">
                <Select {...register('status')} options={STATUS_OPTIONS} />
              </FormField>

              <FormField label="Category">
                <Input {...register('category')} placeholder="General" />
              </FormField>

              <FormField label="Sort order">
                <Input type="number" {...register('order', { valueAsNumber: true })} min={0} />
              </FormField>
            </CardBody>
          </Card>

          <Card flush>
            <CardHeader title="How it works" />
            <CardBody>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>Write knowledge as free-form text — like a book or document.</li>
                <li>Add reference links for the AI to read additional content from.</li>
                <li>The website assistant reads every published entry and answers visitor questions from it — changes reach the website within seconds of saving.</li>
                <li>Only <strong>published</strong> entries are visible to the assistant.</li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>

      <FormFooter
        cancelTo="/ai-knowledge"
        submitLabel={isEdit ? 'Save changes' : 'Create entry'}
        saving={saving}
        dirty={isDirty}
        blocker={blocker}
        entityLabel="knowledge entry"
        /* Back to the last saved values — see FormFooter. */
        onDiscard={discard}
      />
    </form>
  )
}
