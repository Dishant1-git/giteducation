import { useEffect } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'

import { ApiError } from '../../api'
import { AppearsOn } from '../../components/common/AppearsOn'
import { Button } from '../../components/common/Button'
import { Card, CardBody, CardHeader } from '../../components/common/Card'
import { Alert } from '../../components/feedback/Alert'
import { Spinner } from '../../components/feedback/Spinner'
import { DatePicker } from '../../components/form/DatePicker'
import { FormField } from '../../components/form/FormField'
import { ImageField } from '../../components/form/ImageField'
import { Input } from '../../components/form/Input'
import { RichTextEditor } from '../../components/form/RichTextEditor'
import { Select } from '../../components/form/Select'
import { SeoFields } from '../../components/form/SeoFields'
import { SlugInput } from '../../components/form/SlugInput'
import { Switch } from '../../components/form/Switch'
import { TagInput } from '../../components/form/TagInput'
import { Textarea } from '../../components/form/Textarea'
import { FormFooter } from '../../components/layout/FormFooter'
import { PageHeader } from '../../components/layout/PageHeader'
import { SITE_HOST } from '../../config/siteMap'
import { useToast } from '../../hooks/useToast'
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges'
import { STATUS_OPTIONS } from '../courses/courseSchema'
import {
  AgendaEditor,
  EventPhotosEditor,
  HighlightsEditor,
  SpeakersEditor,
} from './EventSectionEditors'
import {
  EVENT_MODE_OPTIONS,
  EVENT_TYPE_OPTIONS,
  emptyEvent,
  eventSchema,
  formatEventDates,
  isUpcoming,
  type EventFormValues,
} from './eventSchema'
import { eventHooks } from './useEvents'

/**
 * One seminar, workshop or guest lecture.
 *
 * Laid out the way the public page reads rather than the way the table is
 * shaped: what it is, when and where, who is speaking, what happens, and what
 * it left behind. An editor filling this in top to bottom has written the page.
 *
 * Everything below the summary is optional. A seminar announced as a date and
 * a title is a real thing to publish, and each section the editor leaves alone
 * is simply left off the page rather than rendered empty.
 */
export default function EventFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const toast = useToast()

  const existing = eventHooks.useOne(id)
  const create = eventHooks.useCreate()
  const update = eventHooks.useUpdate()

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: emptyEvent(),
    mode: 'onBlur',
  })

  useEffect(() => {
    if (existing.data) reset(existing.data as EventFormValues)
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

  const title = useWatch({ control, name: 'title' })
  const summary = useWatch({ control, name: 'summary' })
  const startsOn = useWatch({ control, name: 'startsOn' })
  const endsOn = useWatch({ control, name: 'endsOn' })
  const mode = useWatch({ control, name: 'mode' })

  // Feeds the "where this appears" note — it shows the live URL, which moves
  // with the slug as it is typed.
  const watched = useWatch({ control }) as Record<string, unknown>

  /** Publishes and saves in one action — see the note in BlogFormPage. */
  const publish =
    watched.status === 'published'
      ? undefined
      : () => {
          setValue('status', 'published', { shouldDirty: true })
          void handleSubmit(onSubmit)()
        }

  async function onSubmit(values: EventFormValues) {
    try {
      if (isEdit && id) {
        await update.mutateAsync({ id, input: values })
        toast.success('Event updated.')
      } else {
        await create.mutateAsync(values)
        toast.success('Event created.')
      }
      navigate('/events')
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        for (const [field, message] of Object.entries(error.fieldErrors)) {
          setError(field as keyof EventFormValues, { message })
        }
        toast.error('Please fix the highlighted fields.')
        return
      }
      toast.error('Could not save this event', {
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    }
  }

  if (isEdit && existing.isLoading) {
    return (
      <div className="flex items-center gap-2 p-8 text-sm text-slate-500">
        <Spinner />
        Loading event…
      </div>
    )
  }

  if (isEdit && existing.error) {
    return (
      <Alert tone="error" title="Could not load this event">
        <p>{(existing.error as Error).message}</p>
        <Link to="/events" className="mt-3 inline-block">
          <Button variant="secondary" size="sm">
            Back to events
          </Button>
        </Link>
      </Alert>
    )
  }

  const dateLine = startsOn ? formatEventDates(startsOn, endsOn) : undefined
  const online = mode === 'online'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-24">
      <PageHeader
        title={isEdit ? 'Edit Event' : 'Add Event'}
        breadcrumb={[{ label: 'Events', to: '/events' }, { label: isEdit ? 'Edit' : 'New' }]}
      />

      <AppearsOn module="events" record={watched} saved={isEdit} />

      {Object.keys(errors).length > 0 && (
        <Alert tone="error" title="This event could not be saved">
          Check the highlighted fields below and try again.
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card flush>
            <CardHeader
              title="The event"
              subtitle={
                dateLine
                  ? `${dateLine} · ${isUpcoming({ startsOn, endsOn }) ? 'upcoming' : 'already happened'}`
                  : undefined
              }
            />
            <CardBody className="space-y-5">
              <FormField label="Title" required error={errors.title?.message}>
                <Input
                  {...register('title')}
                  placeholder="e.g. Agentic AI — a three-day hands-on workshop"
                />
              </FormField>

              <FormField label="URL slug" required error={errors.slug?.message}>
                <Controller
                  control={control}
                  name="slug"
                  render={({ field }) => (
                    <SlugInput
                      value={field.value}
                      onChange={field.onChange}
                      source={title}
                    />
                  )}
                />
              </FormField>

              <FormField
                label="Summary"
                required
                description="One or two lines. Shown on the events listing and in search results."
                error={errors.summary?.message}
              >
                <Textarea {...register('summary')} rows={3} maxLength={300} showCount />
              </FormField>

              <FormField
                label="Full description"
                description="Everything else — what it covers, who it is for, what to bring."
                error={errors.body?.message}
              >
                <Controller
                  control={control}
                  name="body"
                  render={({ field }) => (
                    <RichTextEditor value={field.value} onChange={field.onChange} />
                  )}
                />
              </FormField>
            </CardBody>
          </Card>

          <Card flush>
            <CardHeader
              title="What people take away"
              subtitle="A short checklist near the top of the page."
            />
            <CardBody>
              <Controller
                control={control}
                name="highlights"
                render={({ field }) => (
                  <HighlightsEditor value={field.value} onChange={field.onChange} />
                )}
              />
            </CardBody>
          </Card>

          <Card flush>
            <CardHeader title="Schedule" subtitle="The running order, session by session." />
            <CardBody>
              <Controller
                control={control}
                name="agenda"
                render={({ field }) => (
                  <AgendaEditor value={field.value} onChange={field.onChange} />
                )}
              />
            </CardBody>
          </Card>

          <Card flush>
            <CardHeader title="Speakers" subtitle="Who is taking the sessions." />
            <CardBody>
              <Controller
                control={control}
                name="speakers"
                render={({ field }) => (
                  <SpeakersEditor value={field.value} onChange={field.onChange} />
                )}
              />
            </CardBody>
          </Card>

          <Card flush>
            <CardHeader
              title="Photographs"
              subtitle="From the day itself — added after the event."
            />
            <CardBody>
              <Controller
                control={control}
                name="images"
                render={({ field }) => (
                  <EventPhotosEditor value={field.value} onChange={field.onChange} />
                )}
              />
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card flush>
            <CardHeader title="Publishing" />
            <CardBody className="space-y-5">
              <FormField label="Status">
                <Select {...register('status')} options={STATUS_OPTIONS} />
              </FormField>

              <FormField label="Kind of event">
                <Select {...register('eventType')} options={EVENT_TYPE_OPTIONS} />
              </FormField>

              <FormField label="Tags" description="Shared with the blog, so the same word means the same subject.">
                <Controller
                  control={control}
                  name="tags"
                  render={({ field }) => (
                    <TagInput value={field.value} onChange={field.onChange} maxTags={8} />
                  )}
                />
              </FormField>

              <Controller
                control={control}
                name="featured"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    label="Feature this event"
                    description="Featured events are pulled to the top of the listing."
                  />
                )}
              />
            </CardBody>
          </Card>

          <Card flush>
            <CardHeader title="When" />
            <CardBody className="space-y-5">
              <FormField label="Start date" required error={errors.startsOn?.message}>
                <Controller
                  control={control}
                  name="startsOn"
                  render={({ field }) => (
                    <DatePicker value={field.value} onChange={(value) => field.onChange(value ?? '')} />
                  )}
                />
              </FormField>

              <FormField
                label="End date"
                description="Only for an event that runs across more than one day."
                error={errors.endsOn?.message}
              >
                <Controller
                  control={control}
                  name="endsOn"
                  render={({ field }) => (
                    <DatePicker value={field.value} onChange={field.onChange} placeholder="Same day" />
                  )}
                />
              </FormField>

              {/* Native time inputs rather than a picker: a time is two
                  numbers, and every browser already has a control for it that
                  people know how to type into. */}
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Starts at" error={errors.startTime?.message}>
                  <Input type="time" {...register('startTime')} />
                </FormField>

                <FormField label="Ends at" error={errors.endTime?.message}>
                  <Input type="time" {...register('endTime')} />
                </FormField>
              </div>
            </CardBody>
          </Card>

          <Card flush>
            <CardHeader title="Where" />
            <CardBody className="space-y-5">
              <FormField label="Mode">
                <Select {...register('mode')} options={EVENT_MODE_OPTIONS} />
              </FormField>

              {/* An online event has no venue to give. The fields are hidden
                  rather than disabled, because a greyed-out address box still
                  reads as something the editor failed to fill in. */}
              {!online && (
                <>
                  <FormField label="Venue" error={errors.venueName?.message}>
                    <Input {...register('venueName')} placeholder="Alpine Girl's (AIIT) College" />
                  </FormField>

                  <FormField label="Address" error={errors.venueAddress?.message}>
                    <Textarea {...register('venueAddress')} rows={2} maxLength={300} />
                  </FormField>

                  <FormField label="City" error={errors.city?.message}>
                    <Input {...register('city')} placeholder="Jalandhar" />
                  </FormField>

                  <FormField
                    label="Map link"
                    description="A Google Maps link, so “Get directions” goes somewhere."
                    error={errors.mapUrl?.message}
                  >
                    <Input {...register('mapUrl')} placeholder="https://maps.google.com/…" />
                  </FormField>
                </>
              )}

              <FormField
                label="Run with"
                description="The partner college or company, if there is one."
                error={errors.hostName?.message}
              >
                <Input {...register('hostName')} placeholder="Quest Group of Institutions" />
              </FormField>
            </CardBody>
          </Card>

          <Card flush>
            <CardHeader title="Attending" />
            <CardBody className="space-y-5">
              <FormField
                label="Registration link"
                description="Where the “Register” button goes. Without one the button is left off."
                error={errors.registrationUrl?.message}
              >
                <Input {...register('registrationUrl')} placeholder="https://… or /contact" />
              </FormField>

              <FormField
                label="Seats"
                description="Shown as “limited seats” when set. Leave blank if there is no cap."
                error={errors.seats?.message}
              >
                <Controller
                  control={control}
                  name="seats"
                  render={({ field }) => (
                    <Input
                      type="number"
                      min={0}
                      value={field.value ?? ''}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value === '' ? null : Number(event.target.value),
                        )
                      }
                      placeholder="60"
                    />
                  )}
                />
              </FormField>
            </CardBody>
          </Card>

          <Card flush>
            <CardHeader title="Cover image" />
            <CardBody>
              <Controller
                control={control}
                name="coverImage"
                render={({ field }) => (
                  <ImageField value={field.value} onChange={field.onChange} aspect="video" />
                )}
              />
            </CardBody>
          </Card>

          <Controller
            control={control}
            name="seo"
            render={({ field }) => (
              <SeoFields
                value={field.value}
                onChange={field.onChange}
                previewUrl={`${SITE_HOST}/events`}
                fallbackTitle={title}
                fallbackDescription={summary}
                errors={{
                  metaTitle: errors.seo?.metaTitle?.message,
                  metaDescription: errors.seo?.metaDescription?.message,
                }}
              />
            )}
          />
        </div>
      </div>

      <FormFooter
        onPublish={publish}
        cancelTo="/events"
        submitLabel={isEdit ? 'Save changes' : 'Create event'}
        saving={saving}
        dirty={isDirty}
        blocker={blocker}
        entityLabel="event"
        /* Back to the last saved values — see FormFooter. */
        onDiscard={discard}
      />
    </form>
  )
}
