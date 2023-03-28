import express from 'express'
import { Request, Response } from 'express'
import { GetOffersUseCase } from '../../domain/interfaces/use-cases/offers/get-offers'
import { GetReceivedOffersUseCase } from '../../domain/interfaces/use-cases/offers/get-received-offers'

import { authenticateToken } from '../middlewares/authenticateToken'
import { extractAddressFromToken } from '../utils/extractTokenFromRequest'

export default function OffersRouter(
  getOffers: GetOffersUseCase,
  getReceivedOffers: GetReceivedOffersUseCase
) {
  const router = express.Router()

  router.get(
    '/:caskId',
    authenticateToken,
    async (req: Request, res: Response) => {
      const caskId = req.params.caskId
      console.log('CaskId: ', caskId)
      const offers = await getOffers.execute(caskId)
      res.json(offers)
    }
  )

  router.get(
    '/received',
    authenticateToken,
    async (req: Request, res: Response) => {
      const address = extractAddressFromToken(req)
      const receivedOffers = await getReceivedOffers.execute(address)
      res.json(receivedOffers)
    }
  )

  return router
}
