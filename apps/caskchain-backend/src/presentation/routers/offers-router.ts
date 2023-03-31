import express from 'express'
import { Request, Response } from 'express'
import { GetReceivedOffersUseCase } from '../../domain/interfaces/use-cases/offers/get-received-offers'
import { GetSentOffersUseCase } from '../../domain/interfaces/use-cases/offers/get-sent-offers'

import { authenticateToken } from '../middlewares/authenticateToken'
import { extractAddressFromToken } from '../utils/extractTokenFromRequest'

export default function OffersRouter(
  getSentOffers: GetSentOffersUseCase,
  getReceivedOffers: GetReceivedOffersUseCase
) {
  const router = express.Router()

  router.get(
    '/sent',
    authenticateToken,
    async (req: Request, res: Response) => {
      const address = extractAddressFromToken(req)
      console.log('Address offers: ', address)
      const sendOffers = await getSentOffers.execute(address)
      res.json(sendOffers)
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
