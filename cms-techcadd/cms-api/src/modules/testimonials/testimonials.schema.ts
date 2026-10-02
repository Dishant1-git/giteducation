import { z } from 'zod'

import { GOOGLE_URL_MESSAGE, isGoogleUrl } from '../shared/googleUrl.js'

/** An empty string is kept — see the note in blogs.schema.ts. */
const optionalId = z.string().optional()

/**
 * Optional image slots accept null as well as being absent.
 *
 * An image is an object, so '' cannot carry "cleared" the way it does for a
 * scalar id. Absent still means "leave it alone"; null means "remove it".
 * Without this the remove button on the form has no way to reach the server.
 */
const mediaRef = z.object({
  id: z.string().min(1),
  url: z.string().optional(),
  alt: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
})

/** Mirrors `frontend/src/features/testimonials/testimonialSchema.ts`. */
const base = z.object({
  studentName: z.string().min(1, 'Student name is required.').max(80),
  photo: mediaRef.nullish(),
  courseId: optionalId,
  batch: z.string().optional(),
  rating: z
    .number('Choose a rating.')
    .int('Ratings are whole stars.')
    .min(1, 'Choose a rating.')
    .max(5, 'Ratings run from 1 to 5.'),
  quote: z
    .string()
    .min(1, 'The testimonial text is required.')
    .max(500, 'Keep testimonials under 500 characters.'),
  videoUrl: z.string().optional(),
  /**
   * Where this exact testimonial can be read on Google.
   *
   * Checked against the same allowlist a review's link is, which it was not
   * before: this field took any string at all, so `g.page/techcadd` with the
   * scheme left off saved happily and then rendered as a path on our own site.
   * Empty means "no link", and the card simply leaves the link off.
   */
  googleReviewUrl: z
    .string()
    .max(500, 'That link is too long to store.')
    .refine((value) => value === '' || isGoogleUrl(value), GOOGLE_URL_MESSAGE)
    .optional(),
  featured: z.boolean(),
  status: z.enum(['published', 'draft', 'review']),
})

export const testimonialSchema = base.extend({
  rating: z
    .number('Choose a rating.')
    .int('Ratings are whole stars.')
    .min(1, 'Choose a rating.')
    .max(5, 'Ratings run from 1 to 5.')
    .default(5),
  featured: z.boolean().default(false),
  status: z.enum(['published', 'draft', 'review']).default('draft'),
})

/** Defaults stay off the patch schema — see the note in categories.schema.ts. */
export const testimonialPatchSchema = base.partial()

export type TestimonialInput = z.infer<typeof testimonialSchema>
export type TestimonialPatch = z.infer<typeof testimonialPatchSchema>
