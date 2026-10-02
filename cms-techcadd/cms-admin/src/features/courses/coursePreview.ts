import type { CourseFormValues } from './courseSchema'

/**
 * The shape the website's preview route expects.
 *
 * Mirrors `CourseDraft` in the site's lib/course-preview.ts. It is restated
 * here rather than imported because the two apps are separate builds with no
 * shared package — so this file is the seam, and it is deliberately the only
 * place in the CMS that knows the site's field names.
 */
export interface CoursePreviewDraft {
  title: string
  slug: string
  segment: CourseFormValues['segment']
  categoryName?: string
  tagline?: string
  demand?: string
  careers: string[]
  tools: string[]
  highlights: string[]
  salary?: string
  duration?: string
  level: string
  mode: string
  overview?: string
  videoUrl?: string
  videoTitle?: string

  /**
   * Everything the course builder added.
   *
   * A hand-kept mirror of `CmsCourse` on the website, because the two apps do
   * not share a module graph — the same reason previewProtocol duplicates the
   * site's preview-protocol. Derived from the form's own types wherever it
   * can be, so a field that changes shape there fails here rather than
   * silently arriving as the wrong thing.
   */
  eyebrow?: string
  badge?: string
  h1?: string
  intro?: string
  eligibility?: string
  certification?: string
  ctaPrimary?: CourseFormValues['ctaPrimary']
  ctaSecondary?: CourseFormValues['ctaSecondary']
  audience: CourseFormValues['audience']
  audienceIntro?: string
  benefits: CourseFormValues['benefits']
  careerRoles: CourseFormValues['careerRoles']
  projects: CourseFormValues['projects']
  workflow: CourseFormValues['workflow']
  whyPoints: CourseFormValues['whyPoints']
  whyIntro?: string
  comparisonRows: CourseFormValues['comparisonRows']
  comparisonIntro?: string
  comparisonOthers?: string
  comparisonNote?: string
  syllabusIntro?: string
  syllabusNote?: string

  /** Converted from the form's text to the numbers the mapping expects. */
  plans: (Omit<CourseFormValues['plans'][number], 'months'> & { months?: number })[]
  syllabus: (Omit<CourseFormValues['syllabus'][number], 'fromPlan'> & {
    fromPlan?: number
  })[]
}

/**
 * Form state, as the website would read it.
 *
 * The category is sent by name, not id: the site groups courses under the
 * category's label and has no way to resolve an id it never sees.
 */
export function toPreviewDraft(
  values: Partial<CourseFormValues>,
  categoryOptions: { value: string; label: string }[],
): CoursePreviewDraft {
  return {
    title: values.title ?? '',
    slug: values.slug ?? '',
    segment: values.segment ?? 'courses',
    categoryName: categoryOptions.find((c) => c.value === values.categoryId)?.label,
    careers: values.careers ?? [],
    tools: values.tools ?? [],
    highlights: values.highlights ?? [],
    syllabus: (values.syllabus ?? []).map((module) => ({
      ...module,
      fromPlan: module.fromPlan?.trim() ? Number(module.fromPlan) : undefined,
    })),
    duration: values.duration || undefined,
    level: values.level ?? 'beginner',
    mode: values.mode ?? 'offline',
    overview: values.overview || undefined,
    videoUrl: values.videoUrl || undefined,
    videoTitle: values.videoTitle || undefined,

    /* ---- Everything the course builder added. ---- */
    eyebrow: values.eyebrow || undefined,
    badge: values.badge || undefined,
    h1: values.h1 || undefined,
    intro: values.intro || undefined,
    eligibility: values.eligibility || undefined,
    certification: values.certification || undefined,
    ctaPrimary: values.ctaPrimary?.text ? values.ctaPrimary : undefined,
    ctaSecondary: values.ctaSecondary?.text ? values.ctaSecondary : undefined,
    audience: values.audience ?? [],
    benefits: values.benefits ?? [],
    careerRoles: values.careerRoles ?? [],
    projects: values.projects ?? [],
    workflow: values.workflow ?? [],
    whyPoints: values.whyPoints ?? [],
    comparisonRows: values.comparisonRows ?? [],

    /**
     * Numbers, as the mapping expects them.
     *
     * The form holds these as text — a select's value always is — and the
     * preview shares its mapping with the published page, so they have to be
     * converted here exactly as they are on save. Skipping this showed every
     * plan as unnumbered and every module as reachable from plan one.
     */
    plans: (values.plans ?? []).map((plan) => ({
      ...plan,
      months: plan.months?.trim() ? Number(plan.months) : undefined,
    })),

    /**
     * Chosen FAQs, reviews and related courses are not carried.
     *
     * The preview has no lists to resolve ids against, so it shows the
     * generated selection instead — the one place it knowingly differs from
     * the published page, and it differs by showing the fallback rather than
     * by showing something wrong.
     */
  }
}

/**
 * The editor's sections, and the part of the rendered page each one drives.
 *
 * `anchor` is the DOM id the website's course template already gives that
 * block, so selecting a section here scrolls the preview to the thing being
 * edited rather than leaving the editor to hunt for it.
 */
export const COURSE_SECTIONS = [
  { id: 'basics', label: 'Basics', anchor: 'hero' },
  { id: 'page-copy', label: 'Page copy', anchor: 'overview' },
  { id: 'curriculum', label: 'Curriculum', anchor: 'modules' },
  { id: 'layout', label: 'Page layout', anchor: 'overview' },
  { id: 'details', label: 'Details', anchor: 'who-can-do' },
  { id: 'media', label: 'Media', anchor: 'hero' },
  { id: 'publishing', label: 'Publishing', anchor: 'cta' },
  { id: 'seo', label: 'SEO', anchor: 'hero' },
] as const

export type CourseSectionId = (typeof COURSE_SECTIONS)[number]['id']
