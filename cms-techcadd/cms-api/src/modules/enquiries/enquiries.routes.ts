import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'

import { asyncHandler, badRequest, unauthorised } from '../../http/errors.js'
import { parseListParams } from '../../http/listParams.js'
import { requireParam } from '../../http/params.js'
import { requireAuth, requireRole } from '../../middleware/auth.js'
import {
  checkEnquiriesPassword,
  ENQUIRIES_LOCK_COOKIE,
  lockCookieOptions,
  requireEnquiriesUnlock,
} from './enquiries-lock.js'
import * as repo from './enquiries.repo.js'
import {
  enquiryBulkSchema,
  enquiryPatchSchema,
  enquirySchema,
} from './enquiries.schema.js'

export const enquiriesRouter = Router()

/*
  Admin for the whole module, reading included.

  Every other module gates only its mutating routes, because reading published
  content is harmless. This one is different: an enquiry is a prospective
  student's name, phone number and email, submitted to the institute and not to
  whoever happens to have a CMS login. Somebody whose job is uploading blog
  posts has no reason to hold the lead list, so the gate goes on the router
  rather than on the writes.
*/
enquiriesRouter.use(requireAuth, requireRole('admin'))

/*
  And a shared password on top of that.

  The role above answers "may this account hold leads at all". This answers
  "is the person at the keyboard right now the one who should be reading
  them" — which a session cookie left open on a shared machine does not.
  Independent of accounts on purpose, so it can be rotated without touching
  anyone's login.
*/

/** Whether this browser already cleared the enquiries password gate. */
enquiriesRouter.get('/unlock-status', (req, res) => {
  res.json({ unlocked: req.signedCookies?.[ENQUIRIES_LOCK_COOKIE] === '1' })
})

/** Slows guessing at the shared enquiries password. Keyed by IP. */
const unlockLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many attempts. Try again in a few minutes.' },
})

const unlockSchema = z.object({ password: z.string().min(1) })

enquiriesRouter.post(
  '/unlock',
  unlockLimiter,
  asyncHandler(async (req, res) => {
    const { password } = unlockSchema.parse(req.body)
    if (!checkEnquiriesPassword(password)) throw unauthorised('That password is not correct.')

    res.cookie(ENQUIRIES_LOCK_COOKIE, '1', lockCookieOptions)
    res.status(204).end()
  }),
)

/** Re-locks this browser — for a "Lock" button, or leaving a shared machine. */
enquiriesRouter.post('/lock', (_req, res) => {
  res.clearCookie(ENQUIRIES_LOCK_COOKIE, { ...lockCookieOptions, maxAge: undefined })
  res.status(204).end()
})

// Everything below actually reads or writes lead data, so it needs the
// password above — not just the ordinary CMS session checked by requireAuth.
enquiriesRouter.use(requireEnquiriesUnlock)

enquiriesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json(await repo.list(parseListParams(req)))
  }),
)

// Declared before '/:id' so "bulk" is not read as an id.
enquiriesRouter.patch(
  '/bulk',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const updated = await repo.bulkUpdate(enquiryBulkSchema.parse(req.body))
    res.json({ updated })
  }),
)

enquiriesRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    res.json(await repo.get(requireParam(req, 'id')))
  }),
)

enquiriesRouter.post(
  '/',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    res.status(201).json(await repo.create(enquirySchema.parse(req.body)))
  }),
)

enquiriesRouter.patch(
  '/:id',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    res.json(await repo.update(requireParam(req, 'id'), enquiryPatchSchema.parse(req.body)))
  }),
)

const deleteSchema = z.object({ ids: z.array(z.string().min(1)).min(1) })

enquiriesRouter.delete(
  '/',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const parsed = deleteSchema.safeParse(req.body)
    if (!parsed.success) throw badRequest('Provide the ids to delete.')

    await repo.remove(parsed.data.ids)
    res.status(204).end()
  }),
)
