import { z } from 'zod'

export const aiKnowledgeSchema = z.object({
  title: z.string().min(1, 'A title is required.').max(200),
  content: z.string().min(1, 'Content is required.'),
  links: z.array(z.string().url('Each link must be a valid URL.')).default([]),
  category: z.string().min(1, 'Choose a category.').max(80),
  order: z.number(),
  status: z.enum(['published', 'draft', 'review']),
})

export type AiKnowledgeFormValues = z.infer<typeof aiKnowledgeSchema>

export function emptyAiKnowledge(): AiKnowledgeFormValues {
  return {
    title: '',
    content: '',
    links: [],
    category: 'General',
    order: 0,
    status: 'draft',
  }
}
