import express from 'express'
import { Request, Response } from 'express'
import { GetReceivedOffersUseCase } from '../../domain/interfaces/use-cases/offers/get-received-offers'
import { GetSentOffersUseCase } from '../../domain/interfaces/use-cases/offers/get-sent-offers'

import { authenticateToken } from '../middlewares/authenticateToken'
import { extractAddressFromToken } from '../utils/extractTokenFromRequest'
import logger from '../utils/logger' // Import the logger
import { GetOffersUseCase } from '../../domain/interfaces/use-cases/offers/get-offers'

export default function OffersRouter(
  getSentOffers: GetSentOffersUseCase,
  getReceivedOffers: GetReceivedOffersUseCase,
  getNFTLatestOffer: GetOffersUseCase
) {
  const router = express.Router()

  router.get(
    '/sent',
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const address = extractAddressFromToken(req)
        logger.info('Getting sent offers for address: %s', address)
        const sendOffers = await getSentOffers.execute(address)
        res.json(sendOffers)
      } catch (error: any) {
        logger.error('Failed to get sent offers: %s', error.message, { error })
        res.status(500).json({ error: 'Failed to get sent offers' })
      }
    }
  )

  router.get(
    '/received',
    authenticateToken,
    async (req: Request, res: Response) => {
      try {
        const address = extractAddressFromToken(req)
        logger.info('Getting received offers for address: %s', address)
        const receivedOffers = await getReceivedOffers.execute(address)
        res.json(receivedOffers)
      } catch (error: any) {
        logger.error('Failed to get received offers: %s', error.message, {
          error,
        })
        res.status(500).json({ error: 'Failed to get received offers' })
      }
    }
  )

  router.get('/:tokenId', async (req: Request, res: Response) => {
    const { tokenId } = req.params
    try {
      logger.info('Getting received offers for NFT: %s', tokenId)
      const receivedOffers = await getNFTLatestOffer.execute(tokenId)
      res.json(receivedOffers)
    } catch (error: any) {
      logger.error('Failed to get received offers: %s', error.message, {
        error,
      })
      res.status(500).json({ error: 'Failed to get received offers' })
    }
  })

  return router
}
