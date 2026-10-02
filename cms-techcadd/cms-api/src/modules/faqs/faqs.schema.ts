import { z } from 'zod'

/** Mirrors `frontend/src/features/faqs/faqSchema.ts`. */
const base = z.object({
  question: z.string().min(1, 'A question is required.').max(300),
  answer: z.string().min(1, 'An answer is required.'),
  /**
   * A category is required, not optional.
   *
   * The specification asks that a FAQ without one not count as complete, and
   * the website groups by category — an uncategorised question would simply
   * not appear anywhere, which is a worse outcome than being refused here.
   */
  /**
   * Either an existing category's id, or a name to file this under.
   *
   * A name that does not exist yet becomes one. There is no separate category
   * screen any more, so requiring an id would mean a question could only ever
   * join a category somebody had already made — and there would be no way to
   * make the first one.
   */
  categoryId: z.string().optional(),
  categoryName: z.string().max(80).optional(),
  order: z.number(),
  featured: z.boolean(),
  status: z.enum(['published', 'draft', 'review']),
})

export const faqSchema = base.extend({
  category: z.string().min(1).max(80).default('General'),
  order: z.number().default(0),
  featured: z.boolean().default(false),
  status: z.enum(['published', 'draft', 'review']).default('draft'),
})

/** Defaults stay off the patch schema — see the note in categories.schema.ts. */
export const faqPatchSchema = base.partial()

export type FaqInput = z.infer<typeof faqSchema>
export type FaqPatch = z.infer<typeof faqPatchSchema>
