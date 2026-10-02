import { z } from 'zod'


/**
 * Mirrors `frontend/src/features/courses/courseSchema.ts`.
 *
 * Client-side validation is a convenience; this is the guarantee. Anyone can
 * POST straight to the API, so every rule the form enforces has to exist here
 * too — and the messages are kept identical so the CMS shows the same text
 * whichever side rejects it.
 */
/**
 * Optional image slots accept null as well as being absent.
 *
 * An image is an object, so '' cannot carry "cleared" the way it does for a
 * scalar id. Absent still means "leave it alone"; null means "remove it".
 * Without this the remove button on the form has no way to reach the server.
 */
/**
 * A hero button.
 *
 * The URL is only meaningful for the two types that navigate somewhere the
 * editor chooses; 'enquiry' opens the dialog and 'contact' goes to /contact,
 * and asking for an address for either would invite a wrong one. Validated
 * rather than trusted — the same rule content blocks use, which is what stops
 * `javascript:` reaching an href.
 */
/** Same rule as content blocks and the hero buttons — see the note on ctaSchema. */
const sectionLink = z
  .string()
  .max(500, 'That link is too long to store.')
  .refine(
    (v) => v === '' || v.startsWith('/') || /^https?:\/\//i.test(v),
    'Enter a path beginning with "/" for a page on this site, or a full https:// address.',
  )

const ctaSchema = z
  .object({
    text: z.string().max(60, 'Keep button labels short.').default(''),
    type: z.enum(['enquiry', 'contact', 'internal', 'external']).default('enquiry'),
    url: z
      .string()
      .max(500, 'That link is too long to store.')
      .refine(
        (v) => v === '' || v.startsWith('/') || /^https?:\/\//i.test(v),
        'Enter a path beginning with "/" for a page on this site, or a full https:// address.',
      )
      .optional(),
  })

/* ---- The repeatable sections. Empty means "use the generated copy". ---- */

const audienceSchema = z.object({
  title: z.string().max(120),
  body: z.string(),
  icon: z.string().max(40).optional(),
})

const benefitSchema = z.object({
  placement: z.enum(['hero', 'what-you-get']).default('what-you-get'),
  title: z.string().max(120),
  body: z.string().optional(),
  icon: z.string().max(40).optional(),
})

const careerRoleSchema = z.object({
  role: z.string().max(120),
  body: z.string().optional(),
  salaryStart: z.string().max(60).optional(),
  salarySenior: z.string().max(60).optional(),
  market: z.string().max(80).optional(),
  salaryNote: z.string().max(200).optional(),
  icon: z.string().max(40).optional(),
})

const projectSchema = z.object({
  title: z.string().max(160),
  body: z.string(),
  tags: z.array(z.string()).default([]),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  mediaId: z.string().optional(),
  demoUrl: sectionLink.optional(),
  repoUrl: sectionLink.optional(),
  videoUrl: sectionLink.optional(),
})

const pointSchema = z.object({
  title: z.string().max(160),
  body: z.string().optional(),
  icon: z.string().max(40).optional(),
})

const comparisonRowSchema = z.object({
  feature: z.string().max(160),
  ours: z.string().max(200),
  theirs: z.string().max(200),
})

const planSchema = z.object({
  label: z.string().max(80),
  months: z.number().int().min(0).max(120).optional(),
  duration: z.string().max(60).optional(),
  summary: z.string().optional(),
  rangeLabel: z.string().max(80).optional(),
  badge: z.string().max(24).optional(),
  popular: z.boolean().default(false),
})


/** One row of the batch timetable, as giteducation.org prints it. */
const batchSchema = z.object({
  name: z.string().max(80),
  days: z.string().max(80).default(''),
  time: z.string().max(80).default(''),
  mode: z.string().max(80).default(''),
  seats: z.string().max(80).default(''),
})

const mediaRef = z.object({
  id: z.string().min(1),
  url: z.string().optional(),
  alt: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
})

const syllabusModule = z.object({
  id: z.string().optional(),
  title: z.string(),
  topics: z.array(z.string()).default([]),
  hours: z.number().min(0).optional(),
  body: z.string().optional(),
  outcomes: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  project: z.string().max(300).optional(),
  mediaId: z.string().optional(),
  /**
   * The shortest plan that reaches this module, 1-based. Absent means every
   * plan does, which is what a course with no plans wants.
   */
  fromPlan: z.number().int().min(1).max(20).optional(),
})

const seo = z.object({
  // Wider than the usual 60/160: this site's course titles carry the city and
  // a qualifier ("… in Jalandhar | Live Projects & Placement Support"), and the
  // columns hold 120 and 255.
  metaTitle: z.string().max(120, 'Keep meta titles under 120 characters.').optional(),
  metaDescription: z.string().max(255, 'Keep meta descriptions under 255 characters.').optional(),
  keywords: z.array(z.string()).default([]),
  /** Social cards. Blank falls back to the meta title and description. */
  ogTitle: z.string().max(120).optional(),
  ogDescription: z.string().max(300).optional(),
  twitterTitle: z.string().max(120).optional(),
  twitterDescription: z.string().max(300).optional(),
  /** Defaults match what the page emits today. */
  robotsIndex: z.boolean().default(true),
  inSitemap: z.boolean().default(true),
  faqSchema: z.boolean().default(true),
  ogImage: mediaRef.nullish(),
  canonicalUrl: z.string().optional(),
})

/**
 * An optional reference to another record.
 *
 * An empty string is kept, not turned into undefined: undefined disappears from
 * the JSON body, so the server could not tell "leave it alone" from "clear it"
 * and an assigned relation could never be unset. The repositories convert '' to
 * NULL on write.
 */
const optionalId = z.string().optional()

export const courseSchema = z
  .object({
    title: z.string().max(120, 'Keep titles under 120 characters.'),
    slug: z
      .string()
      .regex(/^[a-z0-9-]*$/, 'Use lowercase letters, numbers and hyphens only.'),
    categoryId: optionalId,
    /** Which part of the site this course belongs to — see migration 013. */
    segment: z.enum(['courses', 'internship-training', 'after-12th-courses']).default('courses'),
    shortDescription: z.string().max(200, 'Keep this under 200 characters.'),
    // The copy the public course page is generated from.

    /* ---- Hero. All optional; blank falls through to the generated copy. ---- */
    eyebrow: z.string().max(80).optional(),
    badge: z.string().max(24).optional(),
    h1: z.string().max(200).optional(),
    intro: z.string().max(2000).optional(),
    ctaPrimary: ctaSchema.optional(),
    ctaSecondary: ctaSchema.optional(),
    /** Quick facts, in the order the editor arranged them. */

    /* ---- Repeatable sections ---- */
    audience: z.array(audienceSchema).default([]),
    benefits: z.array(benefitSchema).default([]),
    careerRoles: z.array(careerRoleSchema).default([]),
    projects: z.array(projectSchema).default([]),
    workflow: z.array(pointSchema).default([]),
    whyPoints: z.array(pointSchema).default([]),
    comparisonRows: z.array(comparisonRowSchema).default([]),
    careers: z.array(z.string()).default([]),
    tools: z.array(z.string()).default([]),
    // Optional for the same reason as level and mode below — see
    // 028_course_duration_optional.sql.
    duration: z.string().max(80).optional(),
    // Optional: a course nobody has graded should say nothing rather than
    // claim a level. '' is how the form clears it.
    level: z.union([z.enum(['beginner', 'intermediate', 'advanced']), z.literal('')]).optional(),

    /* ---- What giteducation.org prints that the base schema never held — see 052. ---- */
    /** Key into the website's line-icon set. */
    icon: z.string().max(40).optional(),
    /** The level as worded on the page, e.g. "Beginner to Advanced". */
    levelLabel: z.string().max(80).optional(),
    /** Whole rupees; null or absent means the page states no fee. */
    feeAmount: z.number().int().min(0).max(100000000).nullish(),
    feeInstallments: z.string().max(160).optional(),
    seats: z.number().int().min(0).max(65535).nullish(),
    nextBatch: z.string().max(160).optional(),
    weeklyHours: z.string().max(160).optional(),
    ratingValue: z.number().min(0).max(5).nullish(),
    ratingCount: z.number().int().min(0).nullish(),
    modes: z.array(z.string().max(120)).default([]),
    languages: z.array(z.string().max(60)).default([]),
    batches: z.array(batchSchema).default([]),
    mode: z.union([z.enum(['online', 'offline', 'hybrid']), z.literal('')]).optional(),
    thumbnail: mediaRef.nullish(),
    /*
      Optional media on three sections, stored the way `thumbnail` is: a media
      reference in, a `*_media_id` column out. Alt text comes from the file in
      the library — see the note on the migration.
    */
    syllabus: z.array(syllabusModule).default([]),
    plans: z.array(planSchema).default([]),
    /** Ids into the existing FAQ, Review and Course lists — see 033. */
    faqIds: z.array(z.string()).default([]),
    reviewIds: z.array(z.string()).default([]),
    relatedIds: z.array(z.string()).default([]),
    highlights: z.array(z.string().max(600, 'Keep each line under 600 characters.')).default([]),
    eligibility: z.string().optional(),
    certification: z.string().optional(),
    /** Overrides the generated overview. One paragraph per line. */
    overview: z.string().optional(),
    videoUrl: z.string().max(500).optional(),
    videoTitle: z.string().max(200).optional(),
    /** Generated sections to leave off this course's page. */
    /** DOM ids, in the order they should appear. Empty means as written. */
    /** Generated sections to leave off this course's page. */
    /** DOM ids, in the order they should appear. Empty means as written. */
    /** Blocks the editor added, in the order they were arranged. */
    // Matches the column defaults: index, list, emit FAQ schema.
    seo: seo.default({ keywords: [], robotsIndex: true, inSitemap: true, faqSchema: true }),
    status: z.enum(['published', 'draft', 'review', 'scheduled']).default('draft'),
    /** ISO date-time. */
    scheduledFor: z.string().datetime({ offset: true }).optional(),
  })

export type CourseInput = z.infer<typeof courseSchema>
