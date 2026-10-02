import { z } from 'zod'

import { seoBlockSchema } from '../pages/pageSchema'

const mediaRefSchema = z.object({
  id: z.string(),
  url: z.string(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
})

/** Mirrors `cms-api/src/modules/events/events.schema.ts`. */
export const EVENT_TYPE_OPTIONS = [
  { value: 'seminar', label: 'Seminar' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'demo-class', label: 'Demo class' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'bootcamp', label: 'Bootcamp' },
  { value: 'guest-lecture', label: 'Guest lecture' },
  { value: 'orientation', label: 'Orientation' },
  { value: 'hackathon', label: 'Hackathon' },
]

export const EVENT_MODE_OPTIONS = [
  { value: 'in-person', label: 'In person' },
  { value: 'online', label: 'Online' },
  { value: 'hybrid', label: 'Hybrid' },
]

const dateField = z
  .union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date.'), z.literal('')])
  .optional()

/** `HH:MM` from the time input; seconds tolerated because MySQL returns them. */
const timeField = z
  .union([
    z.string().regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, 'Enter a time like 10:30.'),
    z.literal(''),
  ])
  .optional()

/**
 * A link, or nothing.
 *
 * The same rule the server applies, restated rather than imported because the
 * two apps are separate builds — this is what turns "the save failed" into a
 * message under the field before anything is sent.
 */
const linkField = z
  .string()
  .max(500, 'That link is too long to store.')
  .refine(
    (value) => value === '' || value.startsWith('/') || /^https?:\/\//i.test(value),
    'Enter a path beginning with "/" for a page on this site, or a full https:// address.',
  )
  .optional()

export const speakerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'A speaker needs a name.').max(120),
  role: z.string().max(160).optional(),
  org: z.string().max(160).optional(),
  bio: z.string().max(600, 'Keep speaker bios under 600 characters.').optional(),
  photo: mediaRefSchema.nullish(),
  order: z.number(),
})

export const agendaItemSchema = z.object({
  id: z.string().optional(),
  timeLabel: z.string().max(60).optional(),
  title: z.string().min(1, 'An agenda item needs a title.').max(200),
  detail: z.string().max(600).optional(),
  order: z.number(),
})

export const highlightSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, 'A takeaway cannot be blank.').max(240),
  order: z.number(),
})

export const eventPhotoSchema = z.object({
  id: z.string().optional(),
  media: mediaRefSchema,
  caption: z.string().max(240).optional(),
  order: z.number(),
})

export const eventSchema = z
  .object({
    title: z.string().min(1, 'Title is required.').max(160, 'Keep titles under 160 characters.'),
    slug: z
      .string()
      .min(1, 'Slug is required.')
      .regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers and hyphens only.'),
    eventType: z.enum([
      'seminar',
      'workshop',
      'demo-class',
      'webinar',
      'bootcamp',
      'guest-lecture',
      'orientation',
      'hackathon',
    ]),
    mode: z.enum(['in-person', 'online', 'hybrid']),
    summary: z
      .string()
      .min(1, 'A short summary is required.')
      .max(300, 'Keep the summary under 300 characters.'),
    body: z.string(),
    coverImage: mediaRefSchema.nullish(),

    startsOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'An event needs a start date.'),
    endsOn: dateField,
    startTime: timeField,
    endTime: timeField,

    venueName: z.string().max(160).optional(),
    venueAddress: z.string().max(300).optional(),
    city: z.string().max(80).optional(),
    mapUrl: linkField,
    hostName: z.string().max(160).optional(),

    registrationUrl: linkField,
    seats: z.number().int().min(0).max(100000).nullish(),

    tags: z.array(z.string()),
    highlights: z.array(highlightSchema),
    agenda: z.array(agendaItemSchema),
    speakers: z.array(speakerSchema),
    images: z.array(eventPhotoSchema),

    featured: z.boolean(),
    seo: seoBlockSchema,
    status: z.enum(['published', 'draft', 'review']),
  })
  /*
    An event that ends before it starts.

    Caught here as well as on the server because the public listing splits on
    the end date: a backwards range files a future seminar under "past events",
    and the only symptom the editor sees is that it disappeared from the page
    they were looking at.
  */
  .superRefine((values, ctx) => {
    if (values.startsOn && values.endsOn && values.endsOn < values.startsOn) {
      ctx.addIssue({
        code: 'custom',
        path: ['endsOn'],
        message: 'The end date cannot be before the start date.',
      })
    }
  })

export type EventFormValues = z.infer<typeof eventSchema>
export type SpeakerValues = z.infer<typeof speakerSchema>
export type AgendaItemValues = z.infer<typeof agendaItemSchema>
export type HighlightValues = z.infer<typeof highlightSchema>
export type EventPhotoValues = z.infer<typeof eventPhotoSchema>

/** Today, as the date input wants it. A new event defaults to a real date. */
function today(): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

export function emptyEvent(): EventFormValues {
  return {
    title: '',
    slug: '',
    eventType: 'seminar',
    mode: 'in-person',
    summary: '',
    body: '',
    coverImage: undefined,
    startsOn: today(),
    endsOn: undefined,
    startTime: undefined,
    endTime: undefined,
    venueName: '',
    venueAddress: '',
    city: 'Jalandhar',
    mapUrl: '',
    hostName: '',
    registrationUrl: '',
    seats: undefined,
    tags: [],
    highlights: [],
    agenda: [],
    speakers: [],
    images: [],
    featured: false,
    seo: { keywords: [] },
    status: 'draft',
  }
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

/**
 * "10-12 Aug 2026", "14 Sep 2026", or "" — one line for a range or a day.
 *
 * Built by hand rather than with `toLocaleDateString` so the list page, the
 * form header and the website all print the same string. Same-month ranges
 * collapse to one month name, which is how a person writes it.
 */
export function formatEventDates(startsOn: string, endsOn?: string): string {
  const start = parse(startsOn)
  if (!start) return ''

  const end = endsOn ? parse(endsOn) : undefined
  if (!end || (end.y === start.y && end.m === start.m && end.d === start.d)) {
    return `${start.d} ${MONTHS[start.m - 1]} ${start.y}`
  }

  if (end.y === start.y && end.m === start.m) {
    return `${start.d}–${end.d} ${MONTHS[start.m - 1]} ${start.y}`
  }

  if (end.y === start.y) {
    return `${start.d} ${MONTHS[start.m - 1]} – ${end.d} ${MONTHS[end.m - 1]} ${start.y}`
  }

  return `${start.d} ${MONTHS[start.m - 1]} ${start.y} – ${end.d} ${MONTHS[end.m - 1]} ${end.y}`
}

function parse(iso: string): { y: number; m: number; d: number } | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!match) return undefined
  return { y: Number(match[1]), m: Number(match[2]), d: Number(match[3]) }
}

/**
 * Whether an event is still to come, as of today.
 *
 * The end date decides when there is one, so a three-day workshop stays
 * "upcoming" on its middle day rather than moving to the archive the morning
 * after it opens. Compared as strings — ISO dates sort correctly that way, and
 * building Dates here would drag the browser's timezone into a question that
 * is about the calendar.
 */
export function isUpcoming(event: { startsOn: string; endsOn?: string }, today_ = today()): boolean {
  return (event.endsOn || event.startsOn) >= today_
}
