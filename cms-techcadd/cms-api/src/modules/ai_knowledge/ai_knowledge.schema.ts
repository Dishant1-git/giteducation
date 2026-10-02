import { z } from 'zod'

const base = z.object({
  title: z.string().min(1, 'A title is required.').max(200),
  content: z.string().min(1, 'Content is required.'),
  links: z.array(z.string().url('Each link must be a valid URL.')).default([]),
  category: z.string().min(1).max(80),
  order: z.number(),
  status: z.enum(['published', 'draft', 'review']),
})

export const aiKnowledgeSchema = base.extend({
  category: base.shape.category.default('General'),
  order: base.shape.order.default(0),
  status: base.shape.status.default('draft'),
})

export const aiKnowledgePatchSchema = base.partial()

export type AiKnowledgeInput = z.infer<typeof aiKnowledgeSchema>
export type AiKnowledgePatch = z.infer<typeof aiKnowledgePatchSchema>
