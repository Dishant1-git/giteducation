import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'

import { ApiError } from '../../api'
import type { CourseCreate } from '../../api/resources/courses'
import { AppearsOn } from '../../components/common/AppearsOn'
import { Button } from '../../components/common/Button'
import { Card, CardBody, CardHeader } from '../../components/common/Card'
import { Alert } from '../../components/feedback/Alert'
import { Spinner } from '../../components/feedback/Spinner'
import { FormField } from '../../components/form/FormField'
import { ImageField } from '../../components/form/ImageField'
import { Input } from '../../components/form/Input'
import { Select } from '../../components/form/Select'
import { SeoFields } from '../../components/form/SeoFields'
import { Switch } from '../../components/form/Switch'
import { SlugInput } from '../../components/form/SlugInput'
import { TagInput } from '../../components/form/TagInput'
import { Textarea } from '../../components/form/Textarea'
import { createId } from '../../lib/id'
import { FormFooter } from '../../components/layout/FormFooter'
import { PageHeader } from '../../components/layout/PageHeader'
import { SITE_HOST } from '../../config/siteMap'
import { useToast } from '../../hooks/useToast'
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges'
import { PreviewPane } from '../../components/preview/PreviewPane'
import { SITE_ORIGIN } from '../../components/preview/previewProtocol'
import { CtaFields } from './CtaFields'
import { MultiSelect } from '../../components/form/MultiSelect'
import { SectionBlock } from './SectionBlock'
import { SectionListEditor } from './SectionListEditor'
import { SyllabusEditor } from './SyllabusEditor'
import {
  COURSE_SECTIONS,
  toPreviewDraft,
  type CourseSectionId,
} from './coursePreview'
import {
  courseSchema,
  emptyCourse,
  ICON_OPTIONS,
  LEVEL_OPTIONS,
  MODE_OPTIONS,
  STATUS_OPTIONS,
  type CourseFormValues,
} from './courseSchema'
import { useCourse, useCourseReferenceData, useCreateCourse, useUpdateCourse } from './useCourses'

/** Schema keys as they are labelled on this page, for the error summary. */
const FIELD_LABELS: Record<string, string> = {
  overview: 'Overview',
  videoUrl: 'Video URL',
  videoTitle: 'Video title',
  hiddenSections: 'Hidden sections',
  scheduledFor: 'Publish date',
  sectionOrder: 'Section order',
  sections: 'Page blocks',
  title: 'Course title',
  slug: 'URL slug',
  categoryId: 'Category',
  segment: 'Section',
  tagline: 'Tagline',
  eyebrow: 'Hero label',
  badge: 'Hero badge',
  h1: 'Hero heading',
  intro: 'Hero description',
  ctaPrimary: 'Primary button',
  ctaSecondary: 'Secondary button',
  facts: 'Quick facts',
  faqIds: 'FAQs',
  reviewIds: 'Reviews',
  relatedIds: 'Related courses',
  plans: 'Course plans',
  syllabusIntro: 'Syllabus introduction',
  audience: 'Who it is for',
  benefits: 'What you get',
  careerRoles: 'Career outcomes',
  projects: 'Projects',
  workflow: 'How the work runs',
  whyPoints: 'Why GIT Education',
  feeAmount: 'Course fee',
  seats: 'Seats per batch',
  ratingValue: 'Rating',
  ratingCount: 'Rating count',
  batches: 'Batches',
  comparisonRows: 'Comparison',
  toolItems: 'Tools, in detail',
  demand: 'Who hires for it',
  careers: 'Careers',
  tools: 'Tools',
  salary: 'Salary',
  shortDescription: 'Short description',
  description: 'Full description',
  duration: 'Duration',
  level: 'Level',
  mode: 'Delivery mode',
  thumbnail: 'Thumbnail',
  syllabus: 'Syllabus',
  highlights: 'Highlights',
  eligibility: 'Eligibility',
  certification: 'Certification',
  featured: 'Featured course',
  seo: 'SEO',
  status: 'Status',
}

export default function CourseFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const toast = useToast()

  const existing = useCourse(id)
  const create = useCreateCourse()
  const update = useUpdateCourse()
  const { categoryOptions, faqOptions, reviewOptions, courseOptions } =
    useCourseReferenceData()

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: emptyCourse(),
    mode: 'onBlur',
  })

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = form

  /*
    Populate once the record arrives; `reset` also clears the dirty flag so the
    guard does not fire on an untouched form.

    Layered over `emptyCourse()` rather than used raw. A course saved before a
    field existed — or fetched from an API that does not send one — arrives
    without it, and `undefined` fails the schema for every required array on
    the record. That produced a save that refused with "check the highlighted
    fields" while highlighting nothing, because the field at fault has no
    input to highlight. Defaults fill those gaps; anything the record does
    carry still wins.
  */
  /**
   * The mirror of `forApi`: the record's numbers become the form's strings.
   *
   * Without this a saved plan comes back with `months: 6` where the form's
   * schema wants text, and the whole record fails validation on load — which
   * presents as a form that will not save a course nobody has edited.
   */
  function fromApi(record: Record<string, unknown>) {
    const toText = (value: unknown) =>
      value === null || value === undefined ? '' : String(value)

    /**
     * Fills whichever of an array item's text fields the API left out.
     *
     * The same gap `fromPlan` was patched for below, generalised: a record
     * saved before a field existed, or whose field was simply never given a
     * value, arrives without the key at all, and `undefined` fails the
     * schema the same way a number does. Blank is a valid answer for these
     * fields; missing the key is not, so this turns every gap into the
     * former. Only touches keys actually named — arrays and booleans (topics,
     * tags, popular) are left to their own field-level handling.
     */
    function withText(list: unknown, keys: string[]) {
      if (!Array.isArray(list)) return undefined
      return list.map((item) => {
        if (item === null || typeof item !== 'object') return item
        const patch: Record<string, unknown> = {}
        for (const key of keys) patch[key] = toText((item as Record<string, unknown>)[key])
        return { ...item, ...patch }
      })
    }

    /** Same gap, for the one-off objects (the two hero buttons) rather than a list. */
    function withTextObject(value: unknown, keys: string[]) {
      if (value === null || typeof value !== 'object') return undefined
      const patch: Record<string, unknown> = {}
      for (const key of keys) patch[key] = toText((value as Record<string, unknown>)[key])
      return { ...(value as Record<string, unknown>), ...patch }
    }

    const batches = Array.isArray(record.batches)
      ? (record.batches as Record<string, unknown>[]).map((batch) => ({
          id: createId('row'),
          name: toText(batch.name),
          days: toText(batch.days),
          time: toText(batch.time),
          mode: toText(batch.mode),
          seats: toText(batch.seats),
        }))
      : undefined

    const patchedFields = {
      batches,
      icon: toText(record.icon),
      levelLabel: toText(record.levelLabel),
      feeAmount: toText(record.feeAmount),
      feeInstallments: toText(record.feeInstallments),
      seats: toText(record.seats),
      nextBatch: toText(record.nextBatch),
      weeklyHours: toText(record.weeklyHours),
      ratingValue: toText(record.ratingValue),
      ratingCount: toText(record.ratingCount),
      plans: withText(record.plans, ['months', 'summary', 'badge']),
      syllabus: withText(record.syllabus, ['fromPlan', 'body', 'project']),
      facts: withText(record.facts, ['label', 'value', 'icon', 'suffix']),
      audience: withText(record.audience, ['body']),
      benefits: withText(record.benefits, ['body']),
      careerRoles: withText(record.careerRoles, ['body', 'salaryStart', 'salarySenior', 'market']),
      // videoUrl is the one project field the API has always been free to
      // leave out — see 'A project's own walkthrough' on projectSchema — so a
      // project saved before an editor filled it in arrives without the key.
      projects: withText(record.projects, ['body', 'demoUrl', 'videoUrl']),
      workflow: withText(record.workflow, ['body']),
      whyPoints: withText(record.whyPoints, ['body']),
      comparisonRows: withText(record.comparisonRows, ['feature', 'ours', 'theirs']),
      toolItems: withText(record.toolItems, ['category', 'url']),
      // The API omits `url` entirely for a button that has never had one typed
      // in — 'enquiry' and 'contact' never need it — which otherwise arrives
      // as `undefined` and fails the schema the same way a missing array-item
      // field does.
      ctaPrimary: withTextObject(record.ctaPrimary, ['url']),
      ctaSecondary: withTextObject(record.ctaSecondary, ['url']),
      // Same gap on the social preview fields: nobody has to fill these in,
      // so a course that never had its og/twitter copy written arrives with
      // the keys missing rather than blank.
      seo: withTextObject(record.seo, ['ogTitle', 'ogDescription', 'twitterTitle', 'twitterDescription']),
    }
    const definedPatchedFields = Object.fromEntries(
      Object.entries(patchedFields).filter(([, value]) => value !== undefined),
    )

    /** Back to the wall-clock string the input understands, in local time. */
    const scheduledFor = record.scheduledFor
      ? (() => {
          const when = new Date(record.scheduledFor as string)
          if (Number.isNaN(when.getTime())) return ''
          const pad = (n: number) => String(n).padStart(2, '0')
          return (
            `${when.getFullYear()}-${pad(when.getMonth() + 1)}-${pad(when.getDate())}` +
            `T${pad(when.getHours())}:${pad(when.getMinutes())}`
          )
        })()
      : ''

    return {
      ...record,
      scheduledFor,
      ...definedPatchedFields,
    } as Partial<CourseFormValues>
  }

  useEffect(() => {
    if (existing.data) {
      reset({ ...emptyCourse(), ...fromApi(existing.data as unknown as Record<string, unknown>) })
    }
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

  // `useWatch` rather than `watch()` — the latter subscribes outside React's
  // knowledge and the hook rules reject it.
  const title = useWatch({ control, name: 'title' })
  const slug = useWatch({ control, name: 'slug' })
  const shortDescription = useWatch({ control, name: 'shortDescription' })
  /** Feeds the "starts from" select on each module. */
  const watchedPlans = useWatch({ control, name: 'plans' }) ?? []
  /** Decides whether the schedule date is asked for. */
  const watchedStatus = useWatch({ control, name: 'status' })

  const saving = create.isPending || update.isPending

  const [section, setSection] = useState<CourseSectionId>('basics')
  const sectionRefs = useRef(new Map<string, HTMLElement | null>())

  /** Scrolls the editor column; the preview follows via PreviewPane's focus. */
  function goToSection(id: CourseSectionId) {
    setSection(id)
    sectionRefs.current.get(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }


  // Feeds the "where this appears" note — it shows the live URL, which moves

  // with the slug as it is typed.

  const watched = useWatch({ control }) as Record<string, unknown>

  // The course's address is /<segment>/<slug>, so the hints under the slug and
  // in the search preview have to follow the Section dropdown, not assume /courses.
  const urlSection = (typeof watched.segment === 'string' && watched.segment) || 'courses'

  /**
   * What the preview renders.
   *
   * Recomputed on every keystroke, which is the point — but memoised on the
   * watched values so an unrelated re-render does not post an identical draft
   * into the frame and restart its animations.
   */
  const previewDraft = useMemo(
    () => toPreviewDraft(watched as Parameters<typeof toPreviewDraft>[0], categoryOptions),
    [watched, categoryOptions],
  )

  const previewAnchor = COURSE_SECTIONS.find((s) => s.id === section)?.anchor


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

  /**
   * Turns the form's strings into the numbers the API expects.
   *
   * `months` and `fromPlan` are typed and selected as text — a number input
   * that has been cleared holds '', not 0, and a <select> value is always a
   * string. Converting here rather than in the schema keeps the form's own
   * validation working on what the editor actually sees.
   */
  function forApi(values: CourseFormValues) {
    const toNumber = (value: string) => {
      const parsed = Number(value)
      return value.trim() !== '' && Number.isFinite(parsed) ? parsed : undefined
    }

    return {
      ...values,
      /**
       * `datetime-local` gives a wall-clock string with no zone. The API wants
       * an instant, so it is read in the editor's own timezone — which is what
       * they meant by "10am on Monday".
       */
      scheduledFor:
        values.status === 'scheduled' && values.scheduledFor.trim()
          ? new Date(values.scheduledFor).toISOString()
          : undefined,
      // null rather than undefined for a cleared number: undefined drops out
      // of the JSON body, and the fee would be impossible to remove.
      feeAmount: toNumber(values.feeAmount) ?? null,
      seats: toNumber(values.seats) ?? null,
      ratingValue: toNumber(values.ratingValue) ?? null,
      ratingCount: toNumber(values.ratingCount) ?? null,
      plans: values.plans.map((plan) => ({ ...plan, months: toNumber(plan.months) })),
      syllabus: values.syllabus.map((module) => ({
        ...module,
        fromPlan: toNumber(module.fromPlan ?? ''),
      })),
    }
  }

  async function onSubmit(values: CourseFormValues) {
    try {
      if (isEdit && id) {
        // forApi deliberately returns the API's numeric shape, which is not
        // the form entity's — see the note on forApi.
        await update.mutateAsync({ id, input: forApi(values) as unknown as Partial<CourseCreate> })
        toast.success('Course updated.')
      } else {
        await create.mutateAsync(forApi(values) as unknown as CourseCreate)
        toast.success('Course created.')
      }
      navigate('/courses')
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        // Map server-side validation back onto the offending inputs.
        for (const [field, message] of Object.entries(error.fieldErrors)) {
          setError(field as keyof CourseFormValues, { message })
        }
        toast.error('Please fix the highlighted fields.')
        return
      }
      toast.error('Could not save this course', {
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    }
  }

  if (isEdit && existing.isLoading) {
    return (
      <div className="flex items-center gap-2 p-8 text-sm text-slate-500">
        <Spinner />
        Loading course…
      </div>
    )
  }

  if (isEdit && existing.error) {
    return (
      <Alert tone="error" title="Could not load this course">
        <p>{(existing.error as Error).message}</p>
        <Link to="/courses" className="mt-3 inline-block">
          <Button variant="secondary" size="sm">
            Back to courses
          </Button>
        </Link>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-24">
      <PageHeader
        title={isEdit ? 'Edit Course' : 'Add Course'}
        breadcrumb={[{ label: 'Courses', to: '/courses' }, { label: isEdit ? 'Edit' : 'New' }]}
      />

      <AppearsOn module="courses" record={watched} saved={isEdit} />

      {Object.keys(errors).length > 0 && (
        <Alert tone="error" title="This course could not be saved">
          {/*
            Named, not just "check the highlighted fields".

            Not every field in the schema has an input on this page, so a
            failure on one of those left the editor reading an instruction they
            could not act on. Listing the labels means the message is always
            actionable, even when the offending value is one the form does not
            show.
          */}
          <p>Please fix:</p>
          <ul className="mt-1.5 list-disc space-y-0.5 pl-5">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>
                <strong className="font-medium">{FIELD_LABELS[field] ?? field}</strong>
                {(error as { message?: string })?.message
                  ? ` — ${(error as { message?: string }).message}`
                  : ''}
              </li>
            ))}
          </ul>
        </Alert>
      )}

      {/*
        Editor on the left, the live website on the right.

        The preview is the real site in a frame, not a rebuilt approximation,
        so the question "what will this look like" is answered here rather than
        by saving and going to look. Below xl the two stack: at that width a
        split pane leaves neither side usable.
      */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          {/* Section switcher. Selecting one scrolls this column and tells the
              preview to scroll to the part of the page it controls. */}
          <nav
            aria-label="Course sections"
            className="sticky top-0 z-10 -mx-1 flex gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-white/95 p-1 backdrop-blur"
          >
            {COURSE_SECTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goToSection(item.id)}
                aria-current={section === item.id ? 'true' : undefined}
                className={
                  'shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ' +
                  (section === item.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700')
                }
              >
                {item.label}
              </button>
            ))}
          </nav>

          <section
            id="section-basics"
            ref={(node) => { sectionRefs.current.set('basics', node) }}
            aria-label="Basics"
            className="scroll-mt-4"
          >
          <Card flush>
            <CardHeader title="Basics" />
            <CardBody className="space-y-5">
              <FormField label="Course title" error={errors.title?.message}>
                <Input {...register('title')} placeholder="e.g. Tally Prime with GST" />
              </FormField>

              <FormField label="URL slug" error={errors.slug?.message}>
                <Controller
                  control={control}
                  name="slug"
                  render={({ field }) => (
                    <SlugInput
                      value={field.value}
                      onChange={field.onChange}
                      source={title}
                      baseUrl={`${SITE_HOST}/${urlSection}/`}
                    />
                  )}
                />
              </FormField>

              <FormField
                label="Tagline"
                description="The line under the heading on the course page, and on its card at /courses."
                error={errors.shortDescription?.message}
              >
                <Textarea
                  {...register('shortDescription')}
                  rows={3}
                  maxLength={200}
                  showCount
                  placeholder="A practical, project-based introduction to Python for beginners — live projects, mentor review and placement support."
                />
              </FormField>

            </CardBody>
          </Card>
          </section>

          <section
            id="section-page-copy"
            ref={(node) => { sectionRefs.current.set('page-copy', node) }}
            aria-label="Course page copy"
            className="scroll-mt-4"
          >
          <Card flush>
            <CardHeader
              title="Course page copy"
              subtitle="The sections of the public course page, in the order they appear on it"
            />
            <CardBody className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-[1fr_10rem]">
                <FormField
                  label="Hero label (not shown on the website)"
                  description="This site's course page has no label line above its heading."
                  error={errors.eyebrow?.message}
                >
                  <Input {...register('eyebrow')} placeholder="Artificial Intelligence" />
                </FormField>

                <FormField
                  label="Badge (not shown on the website)"
                  error={errors.badge?.message}
                >
                  <Input {...register('badge')} placeholder="New" />
                </FormField>
              </div>

              <FormField
                label="Page heading"
                description="The main heading on the course page, usually with the city in it. Blank uses the course title."
                error={errors.h1?.message}
              >
                <Input
                  {...register('h1')}
                  placeholder="Artificial Intelligence Certificate Program in Jalandhar"
                />
              </FormField>

              <FormField
                label="Hero description (not shown on the website)"
                description="The page prints the tagline under its heading. This text is used only as the overview when the Course overview box is empty."
                error={errors.intro?.message}
              >
                <Textarea
                  {...register('intro')}
                  rows={3}
                  placeholder="Job-oriented training built on live projects — small batches, daily lab practice and 100% placement assistance."
                />
              </FormField>

              <div className="grid gap-5 lg:grid-cols-2">
                <CtaFields
                  legend="Primary button"
                  name="ctaPrimary"
                  control={control}
                  register={register}
                  errors={errors.ctaPrimary}
                  fallback="Book a free demo class"
                />
                <CtaFields
                  legend="Secondary button"
                  name="ctaSecondary"
                  control={control}
                  register={register}
                  errors={errors.ctaSecondary}
                  fallback="Talk to a counsellor"
                />
              </div>


          <Card flush>
            <CardHeader
              title="Hero image (not shown on the website)"
              subtitle="The course page on this site has no hero picture, so an image chosen here is stored but not displayed"
            />
            <CardBody>
              <FormField
                label="Hero image"
                description="Kept with the course for when the page gains a picture."
                error={errors.thumbnail?.message}
              >
                <Controller
                  control={control}
                  name="thumbnail"
                  render={({ field }) => (
                    <ImageField value={field.value} onChange={field.onChange} aspect="video" />
                  )}
                />
              </FormField>

              {/* The wide band under the hero. It has always reused the hero
                  picture; this gives it one of its own. */}
            </CardBody>
          </Card>

              {/* The overview and its walkthrough video, which the page shows
                  directly under the hero and before the band below. */}
              <FormField
                label="Course overview"
                description="The opening paragraphs of the course page. One paragraph per line."
                error={errors.overview?.message}
              >
                <Textarea
                  {...register('overview')}
                  rows={5}
                  placeholder={
                    "GIT Education's Python Course in Jalandhar is a practical, project-based introduction to programming for beginners.\n" +
                    "It opens with core syntax and data structures, then moves into scripts you actually run against real problems.\n" +
                    "You finish with a small application of your own, CV preparation and interview practice."
                  }
                />
              </FormField>

              <FormField
                label="Walkthrough video (not shown on the website)"
                description="A YouTube or Vimeo address. Stored with the course; the page has no video section yet."
                error={errors.videoUrl?.message}
              >
                <Input
                  {...register('videoUrl')}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </FormField>

              <FormField label="Video title" error={errors.videoTitle?.message}>
                <Input {...register('videoTitle')} placeholder="Course walkthrough" />
              </FormField>

              <SectionBlock label="Course highlights" description="The highlight cards beside the overview: a title, a line of text and an icon.">
                <Controller
                  control={control}
                  name="benefits"
                  render={({ field }) => (
                    <SectionListEditor
                      value={field.value}
                      onChange={field.onChange}
                      numbered={false}
                      blank={() => ({ placement: 'what-you-get' as const, title: '', body: '' })}
                      addLabel="Add benefit"
                      emptyTitle="No highlight cards"
                      emptyDescription="The page reads well without them."
                      fields={[
                        { key: 'title', label: 'Benefit', width: 'half', placeholder: 'Live project portfolio' },
                        { key: 'placement', label: 'Where', kind: 'select', width: 'half',
                          options: [
                            { value: 'what-you-get', label: 'In its own section' },
                            { value: 'hero', label: 'In the hero' },
                          ] },
                        {
                          key: 'body',
                          label: 'Description',
                          kind: 'textarea',
                          placeholder: "You'll leave with 2–3 real projects to show in an interview, not just a certificate.",
                        },
                      ]}
                      getError={(i, key) => errors.benefits?.[i]?.[key]?.message}
                    />
                  )}
                />
              </SectionBlock>


              <SectionBlock label="Who should join" description="Listed in the Eligibility section of the page, in this order.">
                <Controller
                  control={control}
                  name="audience"
                  render={({ field }) => (
                    <SectionListEditor
                      value={field.value}
                      onChange={field.onChange}
                      blank={() => ({ title: '', body: '' })}
                      addLabel="Add group"
                      emptyTitle="No audience listed"
                      emptyDescription="Add a line for each kind of student this course suits."
                      fields={[
                        { key: 'title', label: 'Group', placeholder: 'Students after 12th' },
                        {
                          key: 'body',
                          label: 'Description',
                          kind: 'textarea',
                          placeholder: 'Fresh graduates who want a structured, practical route into the industry.',
                        },
                      ]}
                      getError={(i, key) => errors.audience?.[i]?.[key]?.message}
                    />
                  )}
                />
              </SectionBlock>


              <SectionBlock label="Career outcomes" description="The roles table on the course page: job title, starting salary band and local demand.">
                <Controller
                  control={control}
                  name="careerRoles"
                  render={({ field }) => (
                    <SectionListEditor
                      value={field.value}
                      onChange={field.onChange}
                      blank={() => ({ role: '', body: '', salaryStart: '', salarySenior: '', market: '' })}
                      addLabel="Add role"
                      emptyTitle="No roles listed"
                      emptyDescription="Add a role to fill the career outcomes table."
                      fields={[
                        { key: 'role', label: 'Job title', placeholder: 'Data Analyst' },
                        {
                          key: 'body',
                          label: 'What the role does',
                          kind: 'textarea',
                          placeholder: 'Cleans and analyses business data, and builds the dashboards decisions get made from.',
                        },
                        { key: 'salaryStart', label: 'Starting salary', width: 'half', placeholder: '₹2.4 LPA' },
                        { key: 'salarySenior', label: 'With experience', width: 'half', placeholder: '₹6 LPA' },
                        { key: 'market', label: 'Demand', width: 'half', placeholder: 'High' },
                      ]}
                      getError={(i, key) => errors.careerRoles?.[i]?.[key]?.message}
                    />
                  )}
                />

              </SectionBlock>


              <SectionBlock label="Live projects" description="What a student builds and shows.">
                <Controller
                  control={control}
                  name="projects"
                  render={({ field }) => (
                    <SectionListEditor
                      value={field.value}
                      onChange={field.onChange}
                      blank={() => ({ title: '', body: '', tags: [], demoUrl: '', videoUrl: '' })}
                      addLabel="Add project"
                      emptyTitle="No projects listed"
                      emptyDescription="Add a project to describe what a student builds on this course."
                      fields={[
                        { key: 'title', label: 'Project', placeholder: 'E-commerce Product Catalog' },
                        {
                          key: 'body',
                          label: 'What it involves',
                          kind: 'textarea',
                          placeholder: 'Build a searchable product listing with a cart and checkout flow.',
                        },
                        { key: 'tags', label: 'Technologies', kind: 'tags' },
                        { key: 'demoUrl', label: 'Demo link', placeholder: 'https://your-demo-link.com' },
                        /* Media. Both optional, and both stored in columns the
                           project table has always had. */
                        {
                          key: 'videoUrl',
                          label: 'YouTube link',
                          placeholder: 'https://www.youtube.com/watch?v=…',
                        },
                        { key: 'media', idKey: 'mediaId', label: 'Image', kind: 'image' },
                      ]}
                      getError={(i, key) => errors.projects?.[i]?.[key]?.message}
                    />
                  )}
                />
              </SectionBlock>


              <SectionBlock label="How the work runs (not shown on the website)" description="The course page prints the institute's standard placement steps instead.">
                <Controller
                  control={control}
                  name="workflow"
                  render={({ field }) => (
                    <SectionListEditor
                      value={field.value}
                      onChange={field.onChange}
                      blank={() => ({ title: '', body: '' })}
                      addLabel="Add step"
                      emptyTitle="Not used on this site"
                      emptyDescription="Steps added here are stored but not displayed."
                      fields={[
                        { key: 'title', label: 'Step', placeholder: 'Understand' },
                        {
                          key: 'body',
                          label: 'What happens',
                          kind: 'textarea',
                          placeholder: 'Review the brief, ask questions, and confirm what "done" looks like before writing code.',
                        },
                      ]}
                      getError={(i, key) => errors.workflow?.[i]?.[key]?.message}
                    />
                  )}
                />


              </SectionBlock>


              <SectionBlock label="Why GIT Education (not shown on the website)" description="The course page has no section for these yet.">
                <Controller
                  control={control}
                  name="whyPoints"
                  render={({ field }) => (
                    <SectionListEditor
                      value={field.value}
                      onChange={field.onChange}
                      numbered={false}
                      blank={() => ({ title: '', body: '' })}
                      addLabel="Add reason"
                      emptyTitle="Not used on this site"
                      emptyDescription="Points added here are stored but not displayed."
                      fields={[
                        { key: 'title', label: 'Reason', placeholder: 'Mentors who still ship client work' },
                        {
                          key: 'body',
                          label: 'Detail',
                          kind: 'textarea',
                          placeholder: 'Not full-time lecturers — trainers who are still doing the job they teach.',
                        },
                      ]}
                      getError={(i, key) => errors.whyPoints?.[i]?.[key]?.message}
                    />
                  )}
                />

              </SectionBlock>


              <SectionBlock label="Comparison (not shown on the website)" description="The course page has no comparison table yet.">
                <Controller
                  control={control}
                  name="comparisonRows"
                  render={({ field }) => (
                    <SectionListEditor
                      value={field.value}
                      onChange={field.onChange}
                      numbered={false}
                      blank={() => ({ feature: '', ours: '', theirs: '' })}
                      addLabel="Add row"
                      emptyTitle="Not used on this site"
                      emptyDescription="Rows added here are stored but not displayed."
                      fields={[
                        { key: 'feature', label: 'Feature', width: 'half', placeholder: 'Live project work' },
                        { key: 'ours', label: 'At GIT Education', width: 'half', placeholder: 'Every course, from week one' },
                        { key: 'theirs', label: 'Elsewhere', width: 'half', placeholder: 'Varies, often only at the end' },
                      ]}
                      getError={(i, key) => errors.comparisonRows?.[i]?.[key]?.message}
                    />
                  )}
                />
              </SectionBlock>

              <SectionBlock
                label="FAQs, reviews and related courses"
                description="Chosen from the FAQ, Review and Course modules rather than retyped here — edit the record itself and every course showing it updates."
              >
                <FormField
                  label="FAQs"
                  description="Shown in this order, followed by the three standard questions. Leave empty and the page keeps its built-in questions."
                  error={errors.faqIds?.message}
                >
                  <Controller
                    control={control}
                    name="faqIds"
                    render={({ field }) => (
                      <MultiSelect
                        value={field.value}
                        onChange={field.onChange}
                        options={faqOptions}
                        placeholder="Choose questions…"
                      />
                    )}
                  />
                </FormField>

                <FormField
                  label="Reviews"
                  description="Shown under What students say. Leave empty and the page keeps its built-in reviews."
                  error={errors.reviewIds?.message}
                >
                  <Controller
                    control={control}
                    name="reviewIds"
                    render={({ field }) => (
                      <MultiSelect
                        value={field.value}
                        onChange={field.onChange}
                        options={reviewOptions}
                        placeholder="Choose reviews…"
                      />
                    )}
                  />
                </FormField>

                <FormField
                  label="Related courses"
                  description="The courses in the rail at the foot of the page. Leave empty and the rail is hidden."
                  error={errors.relatedIds?.message}
                >
                  <Controller
                    control={control}
                    name="relatedIds"
                    render={({ field }) => (
                      <MultiSelect
                        value={field.value}
                        onChange={field.onChange}
                        options={courseOptions}
                        placeholder="Choose courses…"
                        maxItems={6}
                      />
                    )}
                  />
                </FormField>
              </SectionBlock>


              <FormField label="Careers (not shown on the website)" description="Use Career outcomes above — the page prints its roles table from there.">
                <Controller
                  control={control}
                  name="careers"
                  render={({ field }) => (
                    <TagInput
                      value={field.value}
                      onChange={field.onChange}
                      maxTags={12}
                      placeholder="e.g. Data Analyst"
                    />
                  )}
                />
              </FormField>

              <FormField
                label="Tools & software"
                description='Software taught. To print them in named groups, write one entry per group: "Accounting: Tally Prime; Busy; QuickBooks".'
              >
                <Controller
                  control={control}
                  name="tools"
                  render={({ field }) => (
                    <TagInput
                      value={field.value}
                      onChange={field.onChange}
                      maxTags={20}
                      placeholder="e.g. Accounting: Tally Prime; Busy"
                    />
                  )}
                />
              </FormField>

              <SectionBlock
                label="Course plans (not shown on the website)"
                description="Enrolment lengths this course offers. Add plans first — each module below then says which plan it starts from, and the comparison table is built from that."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                </div>


                <Controller
                  control={control}
                  name="plans"
                  render={({ field }) => (
                    <SectionListEditor
                      value={field.value}
                      onChange={field.onChange}
                      blank={() => ({ label: '', months: '', summary: '', badge: '', popular: false })}
                      addLabel="Add plan"
                      emptyTitle="One length only"
                      emptyDescription="Most courses run one way. Add plans to offer several enrolment lengths and compare what each covers."
                      fields={[
                        { key: 'label', label: 'Plan name', placeholder: 'Practitioner', width: 'half' },
                        { key: 'months', label: 'Months', placeholder: '3', width: 'half' },
                        {
                          key: 'summary',
                          label: 'Summary',
                          kind: 'textarea',
                          placeholder: 'A fast, focused path for someone who already knows the basics.',
                        },
                        { key: 'badge', label: 'Badge', placeholder: 'Most popular', width: 'half' },
                      ]}
                      getError={(i, key) => errors.plans?.[i]?.[key]?.message}
                    />
                  )}
                />
              </SectionBlock>

            </CardBody>
          </Card>
          </section>

          <section
            id="section-curriculum"
            ref={(node) => { sectionRefs.current.set('curriculum', node) }}
            aria-label="Curriculum"
            className="scroll-mt-4"
          >
          <Card flush>
            <CardHeader title="Curriculum" subtitle="The modules on the course page. Drag to reorder; each lists its hours and topics" />
            <CardBody>
              <Controller
                control={control}
                name="syllabus"
                render={({ field }) => (
                  <SyllabusEditor
                    value={field.value}
                    onChange={field.onChange}
                    plans={watchedPlans}
                    getError={(i) => errors.syllabus?.[i]?.title?.message}
                  />
                )}
              />
            </CardBody>
          </Card>
          </section>

          <section
            id="section-details"
            ref={(node) => { sectionRefs.current.set('details', node) }}
            aria-label="Details"
            className="scroll-mt-4"
          >
          <Card flush>
            <CardHeader title="Facts and batches" />
            <CardBody className="grid gap-5 sm:grid-cols-2">
              <FormField label="Duration" error={errors.duration?.message}>
                <Input {...register('duration')} placeholder="e.g. 6 months" />
              </FormField>

              <FormField label="Level" description="Used to filter the course list here.">
                <Select {...register('level')} options={LEVEL_OPTIONS} />
              </FormField>

              <FormField
                label="Level, as printed"
                description="The wording on the course page."
                error={errors.levelLabel?.message}
              >
                <Input {...register('levelLabel')} placeholder="e.g. Beginner to Advanced" />
              </FormField>

              <FormField label="Icon" description="Drawn on the course card.">
                <Select {...register('icon')} options={ICON_OPTIONS} />
              </FormField>

              <FormField
                label="What you will learn"
                description="One outcome per entry — press Enter after each."
                className="sm:col-span-2"
              >
                <Controller
                  control={control}
                  name="highlights"
                  render={({ field }) => (
                    <TagInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="e.g. Prepare GST returns in Tally Prime"
                    />
                  )}
                />
              </FormField>

              <FormField label="Eligibility" description="One requirement per line." className="sm:col-span-2">
                <Textarea {...register('eligibility')} rows={3} placeholder={'10+2 or above in any stream\nComfortable using a computer'} />
              </FormField>

              <FormField label="Certification" className="sm:col-span-2">
                <Input {...register('certification')} placeholder="e.g. GIT Education Certificate in Tally Prime with GST" />
              </FormField>

              <FormField
                label="Course fee (₹) (not shown on the website)"
                description="The website does not print fees. Kept here for the office's own reference."
                error={errors.feeAmount?.message}
              >
                <Input {...register('feeAmount')} inputMode="numeric" placeholder="e.g. 12000" />
              </FormField>

              <FormField label="Instalments (not shown on the website)" error={errors.feeInstallments?.message}>
                <Input {...register('feeInstallments')} placeholder="e.g. 3 instalments of ₹4,000" />
              </FormField>

              <FormField label="Seats per batch" error={errors.seats?.message}>
                <Input {...register('seats')} inputMode="numeric" placeholder="e.g. 18" />
              </FormField>

              <FormField label="Next batch" error={errors.nextBatch?.message}>
                <Input {...register('nextBatch')} placeholder="e.g. First Monday of every month" />
              </FormField>

              <FormField label="Class load" error={errors.weeklyHours?.message} className="sm:col-span-2">
                <Input {...register('weeklyHours')} placeholder="e.g. 10 hours per week (5 classes)" />
              </FormField>

              <FormField label="Delivery" description="How the course can be attended." className="sm:col-span-2">
                <Controller
                  control={control}
                  name="modes"
                  render={({ field }) => (
                    <TagInput value={field.value} onChange={field.onChange} maxTags={6} placeholder="e.g. Classroom — Jalandhar" />
                  )}
                />
              </FormField>

              <FormField label="Languages" className="sm:col-span-2">
                <Controller
                  control={control}
                  name="languages"
                  render={({ field }) => (
                    <TagInput value={field.value} onChange={field.onChange} maxTags={6} placeholder="e.g. Punjabi" />
                  )}
                />
              </FormField>

              <FormField
                label="Rating"
                description="Out of 5. Only state a figure the institute can stand behind."
                error={errors.ratingValue?.message}
              >
                <Input {...register('ratingValue')} inputMode="decimal" placeholder="e.g. 4.8" />
              </FormField>

              <FormField label="Number of ratings" error={errors.ratingCount?.message}>
                <Input {...register('ratingCount')} inputMode="numeric" placeholder="e.g. 128" />
              </FormField>

              <div className="sm:col-span-2">
                <SectionBlock label="Batches" description="The timetable on the course page. With none, the page asks visitors to call for timings.">
                  <Controller
                    control={control}
                    name="batches"
                    render={({ field }) => (
                      <SectionListEditor
                        value={field.value}
                        onChange={field.onChange}
                        blank={() => ({ name: '', days: '', time: '', mode: '', seats: '' })}
                        addLabel="Add batch"
                        emptyTitle="No batches listed"
                        emptyDescription="Add a batch to print its days and timings on the course page."
                        numbered={false}
                        fields={[
                          { key: 'name', label: 'Batch', width: 'half', placeholder: 'Morning batch' },
                          { key: 'days', label: 'Days', width: 'half', placeholder: 'Mon – Fri' },
                          { key: 'time', label: 'Time', width: 'half', placeholder: '9:00 AM – 11:00 AM' },
                          { key: 'mode', label: 'Mode', width: 'half', placeholder: 'Classroom' },
                          { key: 'seats', label: 'Seats', width: 'half', placeholder: '6 seats left' },
                        ]}
                        getError={(i, key) => errors.batches?.[i]?.[key]?.message}
                      />
                    )}
                  />
                </SectionBlock>
              </div>
              {/* Photographs of the two certificates. With none, the page
                  keeps the drawn mock-ups. */}


            </CardBody>
          </Card>
          </section>

          <section
            id="section-media"
            ref={(node) => { sectionRefs.current.set('media', node) }}
            aria-label="Media"
            className="scroll-mt-4"
          >
          </section>

          <section
            id="section-publishing"
            ref={(node) => { sectionRefs.current.set('publishing', node) }}
            aria-label="Publishing"
            className="scroll-mt-4"
          >
          <Card flush>
            <CardHeader title="Publishing" />
            <CardBody className="space-y-5">
              <FormField label="Status">
                <Select {...register('status')} options={STATUS_OPTIONS} />
              </FormField>

              {/* Only asked for when it is the only thing that makes sense —
                  a date beside "Draft" invites one to be set and ignored. */}
              {watchedStatus === 'scheduled' && (
                <FormField
                  label="Goes live"
                  description="The course stays hidden until this moment, then publishes itself the next time the website asks for courses."
                  error={errors.scheduledFor?.message}
                >
                  <Input type="datetime-local" {...register('scheduledFor')} />
                </FormField>
              )}

              <FormField label="Delivery mode" description="Used to filter the course list here. The page prints the Delivery entries above.">
                <Select {...register('mode')} options={MODE_OPTIONS} />
              </FormField>

              <FormField
                label="Category"
                description={
                  categoryOptions.length === 0 ? 'No categories exist yet.' : undefined
                }
              >
                {/* Controlled — see the note on FacultyFormPage's branch select. */}
                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <Select
                      {...field}
                      value={field.value ?? ''}
                      options={categoryOptions}
                      placeholder="Uncategorised"
                      disabled={categoryOptions.length === 0}
                    />
                  )}
                />
              </FormField>

            </CardBody>
          </Card>
          </section>

          <section
            id="section-seo"
            ref={(node) => { sectionRefs.current.set('seo', node) }}
            aria-label="SEO"
            className="scroll-mt-4"
          >
          <Controller
            control={control}
            name="seo"
            render={({ field }) => (
              <SeoFields
                value={field.value}
                onChange={field.onChange}
                previewUrl={`${SITE_HOST}/${urlSection}/${slug || 'your-slug'}`}
                fallbackTitle={title}
                fallbackDescription={shortDescription}
                errors={{
                  metaTitle: errors.seo?.metaTitle?.message,
                  metaDescription: errors.seo?.metaDescription?.message,
                }}
              />
            )}
          />

          <Card flush className="mt-6">
            <CardHeader
              title="Search and social"
              subtitle="The meta title, description and keywords are used on the course page. The social and indexing options here are stored but not applied by the website yet."
            />
            <CardBody className="space-y-5">
              <div className="grid gap-5 lg:grid-cols-2">
                <FormField
                  label="Social title"
                  description="Used when the page is shared. Blank uses the meta title."
                  error={errors.seo?.ogTitle?.message}
                >
                  <Input
                    {...register('seo.ogTitle')}
                    placeholder="Python Course in Jalandhar | GIT Education"
                  />
                </FormField>
                <FormField
                  label="Social description"
                  error={errors.seo?.ogDescription?.message}
                >
                  <Input
                    {...register('seo.ogDescription')}
                    placeholder="Learn Python with live projects, mentor review and 100% placement assistance."
                  />
                </FormField>
                <FormField
                  label="Twitter title"
                  description="Blank uses the social title, then the heading."
                  error={errors.seo?.twitterTitle?.message}
                >
                  <Input
                    {...register('seo.twitterTitle')}
                    placeholder="Python Course in Jalandhar | GIT Education"
                  />
                </FormField>
                <FormField
                  label="Twitter description"
                  error={errors.seo?.twitterDescription?.message}
                >
                  <Input
                    {...register('seo.twitterDescription')}
                    placeholder="Learn Python with live projects, mentor review and 100% placement assistance."
                  />
                </FormField>
              </div>

              <div className="space-y-3 border-t border-slate-200 pt-5">
                <Controller
                  control={control}
                  name="seo.robotsIndex"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      label="Let search engines index this page"
                      description="Off sends noindex. The page still works for anyone with the link."
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="seo.inSitemap"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      label="List it in sitemap.xml"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="seo.faqSchema"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      label="Publish FAQ structured data"
                      description="Only applies when the course shows FAQs."
                    />
                  )}
                />
              </div>
            </CardBody>
          </Card>
          </section>
        </div>

        {/*
          Sticky, and its own scroll container, so the page under review stays
          in view while the editor works down the form. `liveUrl` is only
          offered once the course exists and is published — a link to a page
          that would 404 is worse than no link.
        */}
        <PreviewPane
          kind="course"
          draft={previewDraft}
          focus={previewAnchor}
          liveUrl={
            isEdit && watched.status === 'published' && slug
              ? `${SITE_ORIGIN}/${urlSection}/${slug}`
              : undefined
          }
          className="h-[70vh] xl:sticky xl:top-4 xl:h-[calc(100vh-7rem)]"
        />
      </div>

      <FormFooter
        onPublish={publish}
        cancelTo="/courses"
        submitLabel={isEdit ? 'Save changes' : 'Create course'}
        saving={saving}
        dirty={isDirty}
        blocker={blocker}
        entityLabel="course"
        /* Back to the last saved values — see FormFooter. */
        onDiscard={discard}
      />
    </form>
  )
}
