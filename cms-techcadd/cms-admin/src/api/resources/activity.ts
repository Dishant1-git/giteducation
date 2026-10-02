import { request } from '../client'

export interface ActivityEntry {
  id: string
  userId: string | null
  userName: string
  action: string
  entityType: string
  entityId: string | null
  entityLabel: string | null
  metadata: unknown
  createdAt: string
}

export interface PersonContribution {
  userId: string | null
  userName: string
  added: number
  updated: number
  published: number
  deleted: number
  blogs: number
  courses: number
  faqs: number
  reviews: number
  pages: number
  testimonials: number
  actions: number
  firstAt: string | null
  lastAt: string | null
  /** Percentage of everything the team added, to one decimal place. */
  share: number
}

export interface ContributionSummary {
  people: number
  added: number
  updated: number
  published: number
  deleted: number
  /** What exists right now, counted from the content rather than the log. */
  live: Record<string, number>
}

export interface Contributions {
  summary: ContributionSummary
  people: PersonContribution[]
  types: { entityType: string; added: number; updated: number; actions: number }[]
  trend: { date: string; added: number; updated: number }[]
}

export interface ActivityFilters {
  userId?: string
  entityType?: string
  action?: string
  from?: string
  to?: string
  page?: number
  pageSize?: number
}

/** Drops empty filters, so an untouched control does not narrow the query. */
function params(filters: ActivityFilters = {}): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== '') search.set(key, String(value))
  }
  const query = search.toString()
  return query ? `?${query}` : ''
}

export const activityApi = {
  contributions(filters?: ActivityFilters): Promise<Contributions> {
    return request<Contributions>(`/activity/contributions${params(filters)}`)
  },

  log(filters?: ActivityFilters): Promise<{ items: ActivityEntry[]; total: number }> {
    return request(`/activity${params(filters)}`)
  },

  person(
    userId: string,
    filters?: ActivityFilters,
  ): Promise<{
    person: PersonContribution | null
    activity: { items: ActivityEntry[]; total: number }
    types: { entityType: string; added: number; updated: number; actions: number }[]
  }> {
    return request(`/activity/people/${userId}${params(filters)}`)
  },

  /**
   * Who created and last touched one record.
   *
   * Available to any signed-in user, not just admins — it is the byline on an
   * edit screen, and an editor who cannot see who wrote what they are editing
   * will just ask in chat instead.
   */
  ownership(
    entityType: string,
    entityId: string,
  ): Promise<{
    createdBy: string | null
    createdAt: string | null
    updatedBy: string | null
    updatedAt: string | null
  }> {
    return request(`/activity/ownership/${entityType}/${entityId}`)
  },
}
