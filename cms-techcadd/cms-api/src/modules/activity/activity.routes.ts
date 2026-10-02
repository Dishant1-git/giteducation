import { Router } from 'express'
import { z } from 'zod'

import { asyncHandler } from '../../http/errors.js'
import { requireParam } from '../../http/params.js'
import { requireAuth, requireRole } from '../../middleware/auth.js'
import * as repo from './activity.repo.js'

export const activityRouter = Router()

/*
  Admin for the analytics, everyone for their own record.

  The specification asks that only admins see the full picture, and that is
  what `requireRole('admin')` below does. `/mine` is deliberately outside it:
  an editor asking what they themselves contributed is not reading anybody
  else's figures, and refusing them their own history would be a strange way
  to run a contribution tracker.
*/
activityRouter.use(requireAuth)

const rangeSchema = z.object({
  userId: z.string().optional(),
  entityType: z.string().max(40).optional(),
  action: z.string().max(20).optional(),
  /** ISO dates. Absent means "since the beginning". */
  from: z.string().optional(),
  to: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(50),
})

function filtersFrom(query: unknown) {
  const parsed = rangeSchema.parse(query)
  return {
    filters: {
      userId: parsed.userId,
      entityType: parsed.entityType,
      action: parsed.action,
      from: parsed.from,
      to: parsed.to,
    },
    page: parsed.page,
    pageSize: parsed.pageSize,
  }
}

/** What one person has contributed — their own, whatever their role. */
activityRouter.get(
  '/mine',
  asyncHandler(async (req, res) => {
    const { filters, page, pageSize } = filtersFrom(req.query)
    const mine = { ...filters, userId: req.user!.userId }
    res.json({
      summary: await repo.summary(mine),
      activity: await repo.list(mine, page, pageSize),
    })
  }),
)

/**
 * Who created and last touched one record.
 *
 * Not admin-only: it is the byline on the edit screen, and an editor who
 * cannot see who wrote the thing they are editing will simply ask in chat.
 */
activityRouter.get(
  '/ownership/:entityType/:entityId',
  asyncHandler(async (req, res) => {
    res.json(
      await repo.ownership(requireParam(req, 'entityType'), requireParam(req, 'entityId')),
    )
  }),
)

activityRouter.use(requireRole('admin'))

/** The whole log, filterable by person, type, action and date range. */
activityRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const { filters, page, pageSize } = filtersFrom(req.query)
    res.json(await repo.list(filters, page, pageSize))
  }),
)

/** Everything the contributions dashboard draws, in one request. */
activityRouter.get(
  '/contributions',
  asyncHandler(async (req, res) => {
    const { filters } = filtersFrom(req.query)
    // In parallel: four independent reads over the same table, and awaiting
    // them in turn would make the dashboard four round trips deep.
    const [summary, people, types, trend] = await Promise.all([
      repo.summary(filters),
      repo.byPerson(filters),
      repo.byType(filters),
      repo.trend(filters),
    ])
    res.json({ summary, people, types, trend })
  }),
)

/** One person's detail page. */
activityRouter.get(
  '/people/:userId',
  asyncHandler(async (req, res) => {
    const userId = requireParam(req, 'userId')
    const { filters, page, pageSize } = filtersFrom(req.query)
    const scoped = { ...filters, userId }

    const [people, activity, types] = await Promise.all([
      repo.byPerson(filters),
      repo.list(scoped, page, pageSize),
      repo.byType(scoped),
    ])

    // Share is computed against the whole team, so it is taken from the team
    // breakdown rather than recomputed from one person's rows.
    const person = people.find((entry) => entry.userId === userId)
    res.json({ person: person ?? null, activity, types })
  }),
)
