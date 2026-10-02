import { Router } from 'express'
import { z } from 'zod'

import { asyncHandler, badRequest, unauthorised } from '../../http/errors.js'
import { parseListParams } from '../../http/listParams.js'
import { requireParam } from '../../http/params.js'
import { requireAuth, requireRole } from '../../middleware/auth.js'
import * as repo from './comments.repo.js'

export const commentsRouter = Router()

/*
  Moderation, for the team.

  Admin rather than editor for anything that changes a comment: approving one
  publishes a stranger's words on the site under our name, and hiding one
  removes what somebody wrote. Reading the queue is open to editors, because
  seeing what has arrived is how anyone knows there is something to do.
*/
commentsRouter.use(requireAuth)

commentsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json(await repo.list(parseListParams(req)))
  }),
)

const statusSchema = z.object({
  ids: z.array(z.string()).min(1),
  status: z.enum(['approved', 'hidden', 'reported', 'pending']),
})

commentsRouter.post(
  '/status',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    if (!req.user) throw unauthorised()
    const { ids, status } = statusSchema.parse(req.body)
    await repo.setStatus(ids, status, req.user.userId)
    res.status(204).end()
  }),
)

commentsRouter.delete(
  '/',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const { ids } = z.object({ ids: z.array(z.string()).min(1) }).parse(req.body)
    await repo.remove(ids)
    res.status(204).end()
  }),
)

const replySchema = z.object({
  body: z
    .string()
    .min(2, 'Please write a reply.')
    .max(4000, 'Please keep replies under 4000 characters.'),
})

commentsRouter.post(
  '/:id/reply',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    if (!req.user) throw unauthorised()
    const { body } = replySchema.parse(req.body)
    const id = await repo.replyAsStaff(requireParam(req, 'id'), body, req.user.name, req.user.userId)
    res.status(201).json({ id })
  }),
)

/* ------------------------------------------------------------------ */
/* The public half, mounted separately — see public.routes.ts           */
/* ------------------------------------------------------------------ */

const submitSchema = z.object({
  authorName: z
    .string()
    .min(2, 'Please give a name.')
    .max(80, 'That name is too long.'),
  /**
   * Optional, and never published.
   *
   * Asked for so a moderator can reply about a comment, not so the site can
   * display it. Requiring it would turn a comment box into a sign-up form for
   * no benefit the visitor receives.
   */
  authorEmail: z.email('That email address does not look right.').optional().or(z.literal('')),
  body: z
    .string()
    .min(2, 'Please write a comment.')
    .max(4000, 'Please keep comments under 4000 characters.'),
  parentId: z.string().optional(),
  /**
   * A field no person fills in.
   *
   * Hidden from sight and from screen readers; a bot that fills every input it
   * finds gives itself away here.
   *
   * Accepted by the schema rather than rejected by it: a validation error
   * naming this field tells a bot exactly which one to leave alone next time.
   * The handler answers as though the comment were accepted, and stores
   * nothing.
   */
  website: z.string().optional(),
})

export function registerPublicComments(router: Router): void {
  router.get(
    '/blogs/:slug/comments',
    asyncHandler(async (req, res) => {
      const items = await repo.publicThread(requireParam(req, 'slug'))
      res.json({ items, total: items.length })
    }),
  )

  router.post(
    '/blogs/:slug/comments',
    asyncHandler(async (req, res) => {
      const input = submitSchema.parse(req.body)

      // The honeypot. Answered as success so a bot learns nothing from the
      // response and does not simply retry with the field removed.
      if (input.website) {
        res.status(202).json({ status: 'pending' })
        return
      }

      const ipHash = repo.hashAddress(req.ip)
      if (await repo.tooManyRecently(ipHash)) {
        throw badRequest('That is a lot of comments in a short time. Please try again shortly.')
      }

      await repo.create(
        {
          blogSlug: requireParam(req, 'slug'),
          parentId: input.parentId,
          authorName: input.authorName,
          authorEmail: input.authorEmail || undefined,
          body: input.body,
        },
        ipHash,
      )

      /*
        202, not 201.

        Nothing has been published: the comment is waiting for a moderator, and
        a 201 with the comment in the body would invite the page to render it
        as though it were live.
      */
      res.status(202).json({ status: 'pending' })
    }),
  )

  router.post(
    '/comments/:id/report',
    asyncHandler(async (req, res) => {
      await repo.report(requireParam(req, 'id'))
      // Always the same answer — see the note in repo.report.
      res.status(202).json({ status: 'reported' })
    }),
  )
}
