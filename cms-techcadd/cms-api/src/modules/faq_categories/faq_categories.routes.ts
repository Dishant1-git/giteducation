import { Router } from 'express'
import { z } from 'zod'

import { asyncHandler, unauthorised } from '../../http/errors.js'
import { requireParam } from '../../http/params.js'
import { requireAuth, requireRole } from '../../middleware/auth.js'
import * as repo from './faq_categories.repo.js'
import { faqCategorySchema } from './faq_categories.schema.js'

export const faqCategoriesRouter = Router()

faqCategoriesRouter.use(requireAuth)

faqCategoriesRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    res.json(await repo.list())
  }),
)

faqCategoriesRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    res.json(await repo.get(requireParam(req, 'id')))
  }),
)

faqCategoriesRouter.post(
  '/',
  requireRole('editor'),
  asyncHandler(async (req, res) => {
    if (!req.user) throw unauthorised()
    res.status(201).json(await repo.create(faqCategorySchema.parse(req.body), req.user.userId))
  }),
)

faqCategoriesRouter.patch(
  '/:id',
  requireRole('editor'),
  asyncHandler(async (req, res) => {
    if (!req.user) throw unauthorised()
    res.json(
      await repo.update(requireParam(req, 'id'), faqCategorySchema.parse(req.body), req.user.userId),
    )
  }),
)

/** Hand-arranged order, applied in one request rather than one per row. */
const reorderSchema = z.object({ ids: z.array(z.string()).min(1) })

faqCategoriesRouter.post(
  '/reorder',
  requireRole('editor'),
  asyncHandler(async (req, res) => {
    await repo.reorder(reorderSchema.parse(req.body).ids)
    res.status(204).end()
  }),
)

/**
 * Deleting takes an optional destination for the questions inside.
 *
 * Admin rather than editor: a category holds other people's work, and moving
 * twenty answers somewhere else is not something to do by accident.
 */
const deleteSchema = z.object({
  ids: z.array(z.string()).min(1),
  moveTo: z.string().optional(),
})

faqCategoriesRouter.delete(
  '/',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const { ids, moveTo } = deleteSchema.parse(req.body)
    await repo.remove(ids, moveTo)
    res.status(204).end()
  }),
)
