import { z } from 'zod'

import { blockLinkUrl } from '../shared/contentBlock.schema.js'

/**
 * Optional image slots accept null as well as being absent.
 *
 * An image is an object, so '' cannot carry "cleared" the way it does for a
 * scalar id. Absent still means "leave it alone"; null means "remove it".
 * Without this the remove button on the form has no way to reach the server.
 */
const mediaRef = z.object({
  id: z.string().min(1),
  url: z.string().optional(),
  alt: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
})

const seo = z.object({
  metaTitle: z.string().max(60, 'Keep meta titles under 60 characters.').optional(),
  metaDescription: z.string().max(160, 'Keep meta descriptions under 160 characters.').optional(),
  keywords: z.array(z.string()),
  ogImage: mediaRef.nullish(),
  canonicalUrl: z.string().optional(),
})

/**
 * The kinds of gathering the institute runs.
 *
 * Enforced here rather than as a MySQL ENUM so adding one is a code change
 * instead of a migration — see the note on the column.
 */
export const EVENT_TYPES = [
  'seminar',
  'workshop',
  // What giteducation.org calls its free taster sessions.
  'demo-class',
  'webinar',
  'bootcamp',
  'guest-lecture',
  'orientation',
  'hackathon',
] as const

export const EVENT_MODES = ['in-person', 'online', 'hybrid'] as const

/** A date, or '' meaning "there isn't one". DATE columns reject the latter. */
const dateField = z
  .union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date.'), z.literal('')])
  .optional()

/**
 * A wall-clock time, or ''.
 *
 * `HH:MM` from the browser's time input, with `HH:MM:SS` accepted because that
 * is the shape MySQL hands back — a record read and saved again unchanged must
 * not fail validation on the way in for having been through the database.
 */
const timeField = z
  .union([
    z.string().regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, 'Enter a time like 10:30.'),
    z.literal(''),
  ])
  .optional()

const speaker = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'A speaker needs a name.').max(120),
  role: z.string().max(160).optional(),
  org: z.string().max(160).optional(),
  bio: z.string().max(600, 'Keep speaker bios under 600 characters.').optional(),
  photo: mediaRef.nullish(),
  order: z.number().default(0),
})

const agendaItem = z.object({
  id: z.string().optional(),
  /** "10:00 - 11:30", "Day 2", or nothing — see the note on the column. */
  timeLabel: z.string().max(60).optional(),
  title: z.string().min(1, 'An agenda item needs a title.').max(200),
  detail: z.string().max(600).optional(),
  order: z.number().default(0),
})

const highlight = z.object({
  id: z.string().optional(),
  text: z.string().min(1, 'A takeaway cannot be blank.').max(240),
  order: z.number().default(0),
})

const eventImage = z.object({
  id: z.string().optional(),
  media: mediaRef,
  caption: z.string().max(240).optional(),
  order: z.number().default(0),
})

/** Mirrors `frontend/src/features/events/eventSchema.ts`. */
const base = z.object({
  title: z.string().min(1, 'Title is required.').max(160, 'Keep titles under 160 characters.'),
  slug: z
    .string()
    .min(1, 'Slug is required.')
    .regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers and hyphens only.'),
  eventType: z.enum(EVENT_TYPES),
  mode: z.enum(EVENT_MODES),
  summary: z
    .string()
    .min(1, 'A short summary is required.')
    .max(300, 'Keep the summary under 300 characters.'),
  body: z.string(),
  coverImage: mediaRef.nullish(),

  startsOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'An event needs a start date.'),
  endsOn: dateField,
  startTime: timeField,
  endTime: timeField,

  venueName: z.string().max(160).optional(),
  venueAddress: z.string().max(300).optional(),
  city: z.string().max(80).optional(),
  /** Same rule content blocks use, so `javascript:` cannot reach an href. */
  mapUrl: blockLinkUrl.optional(),
  hostName: z.string().max(160).optional(),

  registrationUrl: blockLinkUrl.optional(),
  seats: z.number().int().min(0).max(100000).nullish(),

  tags: z.array(z.string().min(1).max(60)),
  highlights: z.array(highlight),
  agenda: z.array(agendaItem),
  speakers: z.array(speaker),
  images: z.array(eventImage),

  featured: z.boolean(),
  seo,
  status: z.enum(['published', 'draft', 'review']),
})

/**
 * An event that ends before it starts.
 *
 * Worth refusing rather than accepting: the public listing splits on the end
 * date, so a backwards range files a future seminar under "past events" and
 * the editor's only clue is that it vanished from the page they were looking
 * at. Compared as strings because ISO dates sort correctly that way.
 */
function assertOrdered(
  values: { startsOn?: string; endsOn?: string },
  ctx: z.RefinementCtx,
): void {
  if (values.startsOn && values.endsOn && values.endsOn < values.startsOn) {
    ctx.addIssue({
      code: 'custom',
      path: ['endsOn'],
      message: 'The end date cannot be before the start date.',
    })
  }
}

export const eventSchema = base
  .extend({
    eventType: z.enum(EVENT_TYPES).default('seminar'),
    mode: z.enum(EVENT_MODES).default('in-person'),
    body: z.string().default(''),
    tags: z.array(z.string().min(1).max(60)).default([]),
    highlights: z.array(highlight).default([]),
    agenda: z.array(agendaItem).default([]),
    speakers: z.array(speaker).default([]),
    images: z.array(eventImage).default([]),
    featured: z.boolean().default(false),
    seo: seo.default({ keywords: [] }),
    status: z.enum(['published', 'draft', 'review']).default('draft'),
  })
  .superRefine(assertOrdered)

/** Defaults stay off the patch schema — see the note in categories.schema.ts. */
export const eventPatchSchema = base.partial().superRefine(assertOrdered)

export type EventInput = z.infer<typeof eventSchema>
export type EventPatch = z.infer<typeof eventPatchSchema>
export type EventSpeakerInput = z.infer<typeof speaker>
export type EventAgendaInput = z.infer<typeof agendaItem>
export type EventHighlightInput = z.infer<typeof highlight>
export type EventImageInput = z.infer<typeof eventImage>
