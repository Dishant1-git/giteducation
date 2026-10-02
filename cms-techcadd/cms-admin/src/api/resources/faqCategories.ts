import { request } from '../client'

export interface FaqCategory {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  order: number
  active: boolean
  /** Questions filed here — what an editor checks before deleting one. */
  faqCount: number
  createdAt: string
  updatedAt: string
}

export type FaqCategoryInput = Omit<
  FaqCategory,
  'id' | 'faqCount' | 'createdAt' | 'updatedAt'
>

export const faqCategoriesApi = {
  list(): Promise<{ items: FaqCategory[]; total: number }> {
    return request('/faq-categories')
  },

  get(id: string): Promise<FaqCategory> {
    return request(`/faq-categories/${id}`)
  },

  create(input: FaqCategoryInput): Promise<FaqCategory> {
    return request('/faq-categories', { method: 'POST', body: input })
  },

  update(id: string, input: FaqCategoryInput): Promise<FaqCategory> {
    return request(`/faq-categories/${id}`, { method: 'PATCH', body: input })
  },

  reorder(ids: string[]): Promise<void> {
    return request('/faq-categories/reorder', { method: 'POST', body: { ids } })
  },

  /**
   * `moveTo` is required when the categories still hold questions — the API
   * refuses otherwise rather than deleting answers along with the heading.
   */
  remove(ids: string[], moveTo?: string): Promise<void> {
    return request('/faq-categories', { method: 'DELETE', body: { ids, moveTo } })
  },
}
