import { Router } from 'express'
import { z } from 'zod'

import { asyncHandler, badRequest } from '../../http/errors.js'
import { parseListParams } from '../../http/listParams.js'
import { requireParam } from '../../http/params.js'
import { requireAuth, requireRole } from '../../middleware/auth.js'
import * as repo from './events.repo.js'
import { eventPatchSchema, eventSchema } from './events.schema.js'

export const eventsRouter = Router()

eventsRouter.use(requireAuth)

eventsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json(await repo.list(parseListParams(req)))
  }),
)

eventsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    res.json(await repo.get(requireParam(req, 'id')))
  }),
)

eventsRouter.post(
  '/',
  requireRole('editor'),
  asyncHandler(async (req, res) => {
    res.status(201).json(await repo.create(eventSchema.parse(req.body)))
  }),
)

eventsRouter.patch(
  '/:id',
  requireRole('editor'),
  asyncHandler(async (req, res) => {
    res.json(await repo.update(requireParam(req, 'id'), eventPatchSchema.parse(req.body)))
  }),
)

const deleteSchema = z.object({ ids: z.array(z.string().min(1)).min(1) })

eventsRouter.delete(
  '/',
  requireRole('editor'),
  asyncHandler(async (req, res) => {
    const parsed = deleteSchema.safeParse(req.body)
    if (!parsed.success) throw badRequest('Provide the ids to delete.')

    await repo.remove(parsed.data.ids)
    res.status(204).end()
  }),
)
