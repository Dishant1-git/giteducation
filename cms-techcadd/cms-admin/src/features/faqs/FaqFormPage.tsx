import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'

import { ApiError } from '../../api'
import { AppearsOn } from '../../components/common/AppearsOn'
import { Button } from '../../components/common/Button'
import { Card, CardBody, CardHeader } from '../../components/common/Card'
import { Alert } from '../../components/feedback/Alert'
import { Spinner } from '../../components/feedback/Spinner'
import { Checkbox } from '../../components/form/Checkbox'
import { FormField } from '../../components/form/FormField'
import { Input } from '../../components/form/Input'
import { NumberInput } from '../../components/form/NumberInput'
import { Select } from '../../components/form/Select'
import { Textarea } from '../../components/form/Textarea'
import { FormFooter } from '../../components/layout/FormFooter'
import { PageHeader } from '../../components/layout/PageHeader'
import { useToast } from '../../hooks/useToast'
import { faqCategoriesApi } from '../../api/resources/faqCategories'
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges'
import { STATUS_OPTIONS } from '../courses/courseSchema'
import { emptyFaq, faqSchema, type FaqFormValues } from './faqSchema'
import { faqHooks } from './useFaqs'

/** The dropdown's last entry — a marker, never saved as a category name. */
const NEW_CATEGORY = '__new_category__'

export default function FaqFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const toast = useToast()

  // Categories are shared and small, so they load once and are cached under
  // their own key rather than being refetched per form.
  const categories = useQuery({
    queryKey: ['faq-categories'],
    queryFn: () => faqCategoriesApi.list(),
  })

  const existing = faqHooks.useOne(id)
  const create = faqHooks.useCreate()
  const update = faqHooks.useUpdate()

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<FaqFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: emptyFaq(),
    mode: 'onBlur',
  })

  useEffect(() => {
    if (!existing.data) return
    /*
      The API describes a saved question's heading as `category`; the form
      edits it as `categoryName`. Resetting with the record as it arrived left
      that field undefined, so opening an existing question showed an empty
      Category — and saving it failed validation until one was picked again.
    */
    const record = existing.data as FaqFormValues & { category?: string }
    reset({ ...record, categoryName: record.categoryName ?? record.category ?? '' })
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

  // Feeds the "where this appears" note — it shows the live URL, which moves
  // with the slug as it is typed.
  const watched = useWatch({ control }) as Record<string, unknown>

  /*
    The Category dropdown.

    A real list of the existing headings, with "Add a new category…" as its
    last entry. It was a text box with a browser datalist behind it: nothing
    looked like a dropdown, the suggestions only appeared once the box was
    focused, and the datalist hides every entry that does not match what has
    been typed — so an editor could not see what categories there were to
    choose from.
  */
  const categoryNames = (categories.data?.items ?? []).map((category) => category.name)
  const currentCategory = typeof watched.categoryName === 'string' ? watched.categoryName : ''
  const matchedCategory = categoryNames.find(
    (name) => name.toLowerCase() === currentCategory.trim().toLowerCase(),
  )
  const [addingCategory, setAddingCategory] = useState(false)
  /*
    Also true for a saved question whose heading is not in the list (it was
    renamed or removed since): it is shown as a typed name rather than as a
    blank dropdown, so nothing about the record is hidden.
  */
  const isNewCategory =
    addingCategory || (categories.isSuccess && currentCategory.trim() !== '' && !matchedCategory)

  /**
   * Publishes and saves in one action.
   *
   * Setting the status select and then pressing Save is two steps that read as
   * one, and the step people miss is the first.
   */
  const publish =
    watched.status === 'published'
      ? undefined
      : () => {
          setValue('status', 'published', { shouldDirty: true })
          void handleSubmit(onSubmit)()
        }

  async function onSubmit(values: FaqFormValues) {
    try {
      if (isEdit && id) {
        await update.mutateAsync({ id, input: values })
        toast.success('Question updated.')
      } else {
        await create.mutateAsync(values)
        toast.success('Question added.')
      }
      navigate('/faqs')
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        for (const [field, message] of Object.entries(error.fieldErrors)) {
          setError(field as keyof FaqFormValues, { message })
        }
        toast.error('Please fix the highlighted fields.')
        return
      }
      toast.error('Could not save this question', {
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    }
  }

  if (isEdit && existing.isLoading) {
    return (
      <div className="flex items-center gap-2 p-8 text-sm text-slate-500">
        <Spinner />
        Loading question…
      </div>
    )
  }

  if (isEdit && existing.error) {
    return (
      <Alert tone="error" title="Could not load this question">
        <p>{(existing.error as Error).message}</p>
        <Link to="/faqs" className="mt-3 inline-block">
          <Button variant="secondary" size="sm">
            Back to FAQ
          </Button>
        </Link>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-24">
      <PageHeader
        title={isEdit ? 'Edit Question' : 'Add Question'}
        breadcrumb={[{ label: 'FAQ', to: '/faqs' }, { label: isEdit ? 'Edit' : 'New' }]}
      />

      <AppearsOn module="faqs" record={watched} saved={isEdit} />

      {Object.keys(errors).length > 0 && (
        <Alert tone="error" title="This question could not be saved">
          Check the highlighted fields below and try again.
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card flush>
            <CardHeader title="Question and answer" />
            <CardBody className="space-y-5">
              <FormField label="Question" required error={errors.question?.message}>
                <Input
                  {...register('question')}
                  placeholder="e.g. Do you offer placement assistance?"
                />
              </FormField>

              <FormField
                label="Answer"
                required
                description="Plain text. Keep it to what someone needs on the phone."
                error={errors.answer?.message}
              >
                <Textarea {...register('answer')} rows={6} />
              </FormField>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card flush>
            <CardHeader title="Placement" />
            <CardBody className="space-y-5">
              <FormField label="Status">
                <Select {...register('status')} options={STATUS_OPTIONS} />
              </FormField>

              <FormField
                label="Category"
                required
                description="The heading this question is listed under on the FAQ page."
                error={errors.categoryName?.message}
              >
                {/*
                  Pick an existing heading, or choose "Add a new category…" and
                  type one.

                  There is no separate category screen any more, so the
                  dropdown still has to be able to make the first one. The API
                  matches on a slug, so a name typed again finds the existing
                  row rather than making a second.
                */}
                <Select
                  value={isNewCategory ? NEW_CATEGORY : (matchedCategory ?? '')}
                  placeholder={categories.isLoading ? 'Loading categories…' : 'Choose a category'}
                  options={[
                    ...categoryNames.map((name) => ({ value: name, label: name })),
                    { value: NEW_CATEGORY, label: '＋ Add a new category…' },
                  ]}
                  onChange={(event) => {
                    const value = event.target.value
                    if (value === NEW_CATEGORY) {
                      setAddingCategory(true)
                      setValue('categoryName', '', { shouldDirty: true })
                      return
                    }
                    setAddingCategory(false)
                    setValue('categoryName', value, { shouldDirty: true, shouldValidate: true })
                  }}
                />
              </FormField>

              {isNewCategory && (
                <FormField
                  label="New category name"
                  required
                  description="Created when you save. It becomes a heading on the FAQ page."
                  error={errors.categoryName?.message}
                >
                  <Input
                    {...register('categoryName')}
                    placeholder="e.g. Hostel & Facilities"
                    autoComplete="off"
                    autoFocus={addingCategory}
                  />
                </FormField>
              )}

              <FormField
                label="Order"
                description="Lower numbers come first within the category."
                error={errors.order?.message}
              >
                <Controller
                  control={control}
                  name="order"
                  render={({ field }) => (
                    <NumberInput
                      value={field.value ?? 0}
                      onChange={(value) => field.onChange(value === '' ? 0 : value)}
                      min={0}
                    />
                  )}
                />
              </FormField>

              <Controller
                control={control}
                name="featured"
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    label="Show on the homepage"
                    description="The homepage shows a short selection, not every question."
                  />
                )}
              />
            </CardBody>
          </Card>
        </div>
      </div>

      <FormFooter
        onPublish={publish}
        cancelTo="/faqs"
        submitLabel={isEdit ? 'Save changes' : 'Add question'}
        saving={saving}
        dirty={isDirty}
        blocker={blocker}
        entityLabel="question"
        /* Back to the last saved values — see FormFooter. */
        onDiscard={discard}
      />
    </form>
  )
}
