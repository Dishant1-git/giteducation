/**
 * The date ranges the contribution views offer.
 *
 * Computed in the browser and sent as plain dates, because "this month" means
 * the editor's month. A server deciding it would answer in whatever timezone
 * the server happens to run in, which is the sort of thing nobody notices
 * until a figure is one day out at a month boundary.
 */

export type RangeId = 'today' | 'week' | 'month' | 'last-month' | 'year' | 'all' | 'custom'

export const RANGES: { id: RangeId; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This week' },
  { id: 'month', label: 'This month' },
  { id: 'last-month', label: 'Last month' },
  { id: 'year', label: 'This year' },
  { id: 'all', label: 'All time' },
  { id: 'custom', label: 'Custom' },
]

const iso = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** `from`/`to` for a range, or empty for all time. */
export function boundsFor(range: RangeId, custom?: { from: string; to: string }) {
  const now = new Date()

  switch (range) {
    case 'today':
      return { from: iso(now), to: iso(now) }

    case 'week': {
      // Monday, not Sunday: the working week is what a contribution report is
      // about, and a Sunday start puts the weekend at the wrong end of it.
      const monday = new Date(now)
      const weekday = (now.getDay() + 6) % 7
      monday.setDate(now.getDate() - weekday)
      return { from: iso(monday), to: iso(now) }
    }

    case 'month':
      return { from: iso(new Date(now.getFullYear(), now.getMonth(), 1)), to: iso(now) }

    case 'last-month': {
      const first = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      // Day 0 of this month is the last day of the previous one.
      const last = new Date(now.getFullYear(), now.getMonth(), 0)
      return { from: iso(first), to: iso(last) }
    }

    case 'year':
      return { from: iso(new Date(now.getFullYear(), 0, 1)), to: iso(now) }

    case 'custom':
      return { from: custom?.from || undefined, to: custom?.to || undefined }

    case 'all':
    default:
      return {}
  }
}

/** "25 Aug 2026, 10:35 AM" — the format the activity list reads in. */
export function formatWhen(value: string | null): string {
  if (!value) return '—'
  // The API sends "YYYY-MM-DD HH:MM:SS.mmm"; Safari refuses that without the T.
  const date = new Date(value.replace(' ', 'T'))
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/** How each action reads in a sentence: "Sandeep added Blog: …". */
export const ACTION_WORDS: Record<string, string> = {
  created: 'added',
  updated: 'updated',
  published: 'published',
  unpublished: 'unpublished',
  deleted: 'deleted',
  approved: 'approved',
  hidden: 'hid',
}

/** Singular labels, so the log says "Blog" rather than "blogs". */
export const TYPE_WORDS: Record<string, string> = {
  blogs: 'Blog',
  courses: 'Course',
  faqs: 'FAQ',
  reviews: 'Review',
  pages: 'Page',
  testimonials: 'Testimonial',
  categories: 'Category',
  gallery: 'Album',
  media: 'Media',
  redirects: 'Redirect',
  users: 'Account',
  settings: 'Settings',
  enquiries: 'Enquiry',
  'ai-knowledge': 'AI note',
}
