import { z } from 'zod'

export const faqSchema = z.object({
  question: z.string().min(1, 'A question is required.').max(300),
  answer: z.string().min(1, 'An answer is required.'),
  /** The heading, by name. Resolved to a row by the API — new names are created. */
  categoryName: z.string().min(1, 'Choose or type a category.').max(80),
  order: z.number(),
  featured: z.boolean(),
  status: z.enum(['published', 'draft', 'review']),
})

export type FaqFormValues = z.infer<typeof faqSchema>

export function emptyFaq(): FaqFormValues {
  return {
    question: '',
    answer: '',
    categoryName: '',
    order: 0,
    featured: false,
    status: 'draft',
  }
}

/**
 * Starting points, not a closed list.
 *
 * The column is free text so a new section needs no migration; these are only
 * what the datalist suggests.
 */
export const FAQ_CATEGORY_SUGGESTIONS = [
  'Admissions',
  'Courses & Batches',
  'Fees',
  'Placement',
  'Certification',
  'General',
]
