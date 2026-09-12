import { Router, Request, Response } from 'express'
import { requireAuth } from '../middleware/auth.middleware'
import { SaveImageSchema, GetImagesQuerySchema, DeleteImageSchema } from '../types/image.types'
import { logger } from '../config/logger'

// TODO: Use TCB CloudBase JS SDK on frontend for data storage

export const imageRouter: Router = Router()

// 所有路由都需要认证
imageRouter.use(requireAuth)

/**
 * GET /api/images
 */
imageRouter.get('/', async (req: Request, res: Response) => {
  const parseResult = GetImagesQuerySchema.safeParse(req.query)
  if (!parseResult.success) {
    return res.status(400).json({
      error: '参数错误',
      details: parseResult.error.flatten().fieldErrors,
    })
  }

  return res.json({
    images: [],
    pagination: {
      page: parseResult.data.page,
      limit: parseResult.data.limit,
      total: 0,
      totalPages: 0,
    },
  })
})

/**
 * POST /api/images
 */
imageRouter.post('/', async (req: Request, res: Response) => {
  const parseResult = SaveImageSchema.safeParse(req.body)
  if (!parseResult.success) {
    return res.status(400).json({
      error: '参数错误',
      details: parseResult.error.flatten().fieldErrors,
    })
  }

  logger.info('Image save requested')

  return res.status(201).json({
    ...parseResult.data,
    id: '',
    createdAt: new Date().toISOString(),
  })
})

/**
 * DELETE /api/images/:id
 */
imageRouter.delete('/:id', async (req: Request, res: Response) => {
  const parseResult = DeleteImageSchema.safeParse({ id: req.params.id })
  if (!parseResult.success) {
    return res.status(400).json({
      error: '参数错误',
      details: parseResult.error.flatten().fieldErrors,
    })
  }

  logger.info({ imageId: parseResult.data.id }, 'Image delete requested')

  return res.json({ success: true })
})
