import type { EnquirySource, EnquiryStatus } from '../../types'

export const SOURCE_OPTIONS: { value: EnquirySource; label: string }[] = [
  { value: 'website', label: 'Website' },
  { value: 'walk-in', label: 'Walk-in' },
  { value: 'phone', label: 'Phone' },
  { value: 'referral', label: 'Referral' },
  { value: 'social', label: 'Social' },
]

export const STATUS_OPTIONS: { value: EnquiryStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'follow-up', label: 'Follow-up' },
  { value: 'converted', label: 'Converted' },
  { value: 'closed', label: 'Closed' },
]

/** The `formType` the website's counselling dialog files its bookings under. */
export const COUNSELLING_FORM_TYPE = 'Virtual Counselling'

/**
 * The slots the website offers, for moving a booking. Mirrors
 * COUNSELLING_SLOTS in the site's src/lib/counselling.ts.
 */
export const COUNSELLING_SLOT_OPTIONS = [
  '10:00 AM – 10:30 AM',
  '11:30 AM – 12:00 PM',
  '2:00 PM – 2:30 PM',
  '4:00 PM – 4:30 PM',
  '6:00 PM – 6:30 PM',
].map((slot) => ({ value: slot, label: slot }))

/**
 * The working pipeline, in order. `converted` and `closed` are the two ways an
 * enquiry ends, so they sit outside the progression.
 */
export const PIPELINE: EnquiryStatus[] = ['new', 'contacted', 'follow-up']
export const OUTCOMES: EnquiryStatus[] = ['converted', 'closed']

export function sourceLabel(source: EnquirySource): string {
  return SOURCE_OPTIONS.find((option) => option.value === source)?.label ?? source
}

export function statusLabel(status: EnquiryStatus): string {
  return STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status
}

/** Digits only — `wa.me` rejects spaces, plus signs and punctuation. */
export function whatsAppLink(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}
