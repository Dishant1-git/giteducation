import { z } from 'zod'

/**
 * Mirrors the CMS form's own schema. Client validation is a convenience; this
 * is the guarantee — anyone can POST straight to the API.
 */
export const faqCategorySchema = z.object({
  name: z.string().min(1, 'A category needs a name.').max(80),
  /**
   * Derived from the name in the form, but editable and validated here.
   *
   * It becomes a URL — /faqs/placements — so the same rule the course slug
   * uses applies: lowercase, digits and hyphens, nothing that would need
   * escaping or could change what path it points at.
   */
  slug: z
    .string()
    .min(1, 'A category needs a slug.')
    .max(80)
    .regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers and hyphens only.'),
  description: z.string().max(300).optional(),
  icon: z.string().max(40).optional(),
  order: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
})

export type FaqCategoryInput = z.infer<typeof faqCategorySchema>
