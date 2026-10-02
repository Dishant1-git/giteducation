import { z } from 'zod'

const mediaRefSchema = z.object({
  id: z.string(),
  url: z.string(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
})

const seoSchema = z.object({
  ogTitle: z.string().max(120, 'Keep social titles under 120 characters.'),
  ogDescription: z.string().max(300),
  twitterTitle: z.string().max(120),
  twitterDescription: z.string().max(300),
  robotsIndex: z.boolean(),
  inSitemap: z.boolean(),
  faqSchema: z.boolean(),
  // Wider than the usual 60/160 — see the note on the API's schema.
  metaTitle: z.string().max(120, 'Keep meta titles under 120 characters.').optional(),
  metaDescription: z.string().max(255, 'Keep meta descriptions under 255 characters.').optional(),
  keywords: z.array(z.string()),
  ogImage: mediaRefSchema.nullish(),
  canonicalUrl: z.string().optional(),
})

/** Mirrors ctaSchema in the API — see the note there on why url is conditional. */
const ctaFormSchema = z.object({
  text: z.string().max(60, 'Keep button labels short.'),
  type: z.enum(['enquiry', 'contact', 'internal', 'external']),
  url: z
    .string()
    .max(500, 'That link is too long to store.')
    .refine(
      (v) => v === '' || v.startsWith('/') || /^https?:\/\//i.test(v),
      'Enter a path beginning with "/" for a page on this site, or a full https:// address.',
    ),
})

/* ---- Repeatable sections. `id` is client-side only, for list keys. ---- */

const rowLink = z
  .string()
  .max(500, 'That link is too long to store.')
  .refine(
    (v) => v === '' || v.startsWith('/') || /^https?:\/\//i.test(v),
    'Enter a path beginning with "/" or a full https:// address.',
  )

const audienceForm = z.object({
  id: z.string(),
  title: z.string().max(120),
  body: z.string(),
})

const benefitForm = z.object({
  id: z.string(),
  placement: z.enum(['hero', 'what-you-get']),
  title: z.string().max(120),
  body: z.string(),
})

const careerRoleForm = z.object({
  id: z.string(),
  role: z.string().max(120),
  body: z.string(),
  salaryStart: z.string().max(60),
  salarySenior: z.string().max(60),
  market: z.string().max(80),
})

/**
 * The picture on one repeating item, as the form carries it.
 *
 * `mediaId` is what the API has always stored and is what gets saved;
 * `media` is the file itself, sent by the API so a preview can be drawn and
 * dropped again on the way back — the server keeps the id, not the address.
 * Both optional: media on any of these items is, and stays, entirely optional.
 */
const itemMedia = {
  mediaId: z.string().optional(),
  media: mediaRefSchema.nullish(),
}

const projectForm = z.object({
  id: z.string(),
  title: z.string().max(160),
  body: z.string(),
  tags: z.array(z.string()),
  demoUrl: rowLink,
  ...itemMedia,
  /* The project's own walkthrough. Same link rule as demoUrl. */
  videoUrl: rowLink,
})

const pointForm = z.object({
  id: z.string(),
  title: z.string().max(160),
  body: z.string(),
})

const comparisonRowForm = z.object({
  id: z.string(),
  feature: z.string().max(160),
  ours: z.string().max(200),
  theirs: z.string().max(200),
})


const planForm = z.object({
  id: z.string(),
  label: z.string().max(80),
  months: z.string().max(4),
  summary: z.string(),
  badge: z.string().max(24),
  popular: z.boolean(),
})


/** One row of the batch timetable. `id` is client-side only, for list keys. */
const batchForm = z.object({
  id: z.string(),
  name: z.string().max(80),
  days: z.string().max(80),
  time: z.string().max(80),
  mode: z.string().max(80),
  seats: z.string().max(80),
})

/** A whole number typed into a text box, or nothing. */
const wholeNumberText = z.string().regex(/^\d*$/, 'Digits only.')

const syllabusModuleSchema = z.object({
  id: z.string(),
  title: z.string(),
  topics: z.array(z.string()),
  hours: z.number().min(0).optional(),
  // Optional below: a freshly added module (SyllabusEditor's `add()`) only
  // sets id/title/topics, and outcomes/tools have no field in this editor at
  // all — requiring them here made every new module unsaveable until an
  // editor happened to touch fields the UI never asks for.
  body: z.string().optional(),
  outcomes: z.array(z.string()).optional(),
  tools: z.array(z.string()).optional(),
  project: z.string().max(300).optional(),
  ...itemMedia,
  /**
   * The shortest plan that reaches this module, 1-based, as a string because
   * it comes from a <select>. Blank means every plan reaches it.
   */
  fromPlan: z.string().optional(),
})

export const courseSchema = z
  .object({
    title: z.string().max(120, 'Keep titles under 120 characters.'),
    slug: z
      .string()
      .regex(/^[a-z0-9-]*$/, 'Use lowercase letters, numbers and hyphens only.'),
    categoryId: z.string().optional(),
    segment: z.enum(['courses', 'internship-training', 'after-12th-courses']),
    eyebrow: z.string().max(80, 'Keep the label short.'),
    badge: z.string().max(24, 'A badge is a word, not a sentence.'),
    h1: z.string().max(200, 'Keep the heading under 200 characters.'),
    intro: z.string().max(2000, 'Keep the hero paragraph under 2000 characters.'),
    ctaPrimary: ctaFormSchema,
    ctaSecondary: ctaFormSchema,
    plans: z.array(planForm),
    faqIds: z.array(z.string()),
    reviewIds: z.array(z.string()),
    relatedIds: z.array(z.string()),
    audience: z.array(audienceForm),
    benefits: z.array(benefitForm),
    careerRoles: z.array(careerRoleForm),
    projects: z.array(projectForm),
    workflow: z.array(pointForm),
    whyPoints: z.array(pointForm),
    comparisonRows: z.array(comparisonRowForm),
    careers: z.array(z.string()),
    tools: z.array(z.string()),
    shortDescription: z.string().max(200, 'Keep this under 200 characters.'),
    /* ---- Fees, batches and the facts strip — see migration 052. ---- */
    icon: z.string(),
    levelLabel: z.string().max(80),
    // Text in the form, numbers on the wire: a cleared number input holds ''
    // and the page must be able to state no fee at all.
    feeAmount: wholeNumberText,
    feeInstallments: z.string().max(160),
    seats: wholeNumberText,
    nextBatch: z.string().max(160),
    weeklyHours: z.string().max(160),
    ratingValue: z.string().regex(/^(\d(\.\d)?)?$/, 'A rating like 4.8.'),
    ratingCount: wholeNumberText,
    modes: z.array(z.string()),
    languages: z.array(z.string()),
    batches: z.array(batchForm),
    duration: z.string().max(80, 'Keep the duration short.'),
    // '' means "not stated". A course nobody has graded should say nothing on
    // its page rather than claim a level, so the facts strip keeps the
    // segment's generic wording until someone decides.
    level: z.union([z.enum(['beginner', 'intermediate', 'advanced']), z.literal('')]),
    mode: z.union([z.enum(['online', 'offline', 'hybrid']), z.literal('')]),
    thumbnail: mediaRefSchema.nullish(),
    /* Optional media on three sections — stored the way `thumbnail` is. */
    syllabus: z.array(syllabusModuleSchema),
    highlights: z.array(z.string()),
    eligibility: z.string().optional(),
    certification: z.string().optional(),
    /** Overrides the generated overview. One paragraph per line. */
    overview: z.string().optional(),
    videoUrl: z.string().max(500).optional(),
    videoTitle: z.string().max(200).optional(),
    seo: seoSchema,
    status: z.enum(['published', 'draft', 'review', 'scheduled']),
    /** Local date-time from the form; sent as ISO. */
    scheduledFor: z.string(),
  })

export type CourseFormValues = z.infer<typeof courseSchema>

export function emptyCourse(): CourseFormValues {
  return {
    title: '',
    slug: '',
    categoryId: undefined,
    segment: 'courses',
    eyebrow: '',
    badge: '',
    h1: '',
    intro: '',
    ctaPrimary: { text: '', type: 'enquiry', url: '' },
    ctaSecondary: { text: '', type: 'contact', url: '' },
    plans: [],
    faqIds: [],
    reviewIds: [],
    relatedIds: [],
    audience: [],
    benefits: [],
    careerRoles: [],
    projects: [],
    workflow: [],
    whyPoints: [],
    comparisonRows: [],
    careers: [],
    tools: [],
    shortDescription: '',
    icon: '',
    levelLabel: '',
    feeAmount: '',
    feeInstallments: '',
    seats: '',
    nextBatch: '',
    weeklyHours: '',
    ratingValue: '',
    ratingCount: '',
    modes: [],
    languages: [],
    batches: [],
    duration: '',
    level: '',
    mode: '',
    thumbnail: undefined,
    syllabus: [],
    highlights: [],
    eligibility: '',
    certification: '',
    overview: '',
    videoUrl: '',
    videoTitle: '',
    seo: {
      keywords: [],
      ogTitle: '',
      ogDescription: '',
      twitterTitle: '',
      twitterDescription: '',
      robotsIndex: true,
      inSitemap: true,
      faqSchema: true,
    },
    status: 'draft',
    scheduledFor: '',
  }
}

export const LEVEL_OPTIONS = [
  { value: '', label: 'Not stated' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

/**
 * The website's line icons (`lineIcons` in its src/lib/site.ts).
 *
 * Restated rather than imported: the two apps are separate builds. A key that
 * is not in the site's set simply draws no icon there.
 */
export const ICON_OPTIONS = [
  { value: '', label: 'Default' },
  ...[
    'monitor', 'document', 'chart', 'receipt', 'keyboard', 'type', 'cube', 'pen',
    'printer', 'brain', 'megaphone', 'shield', 'clock', 'users', 'briefcase',
    'certificate', 'sparkle', 'rupee', 'location', 'phone', 'mail', 'download',
    'check', 'calendar', 'target', 'book', 'code', 'building', 'chip', 'robot',
  ].map((value) => ({ value, label: value.charAt(0).toUpperCase() + value.slice(1) })),
]

export const MODE_OPTIONS = [
  { value: '', label: 'Not stated' },
  { value: 'offline', label: 'Offline' },
  { value: 'online', label: 'Online' },
  { value: 'hybrid', label: 'Hybrid' },
]

export const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'review', label: 'In Review' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'published', label: 'Published' },
]
