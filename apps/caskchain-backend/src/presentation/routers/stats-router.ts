import express, { NextFunction } from 'express'
import { Request, Response } from 'express'

import logger from '../utils/logger'
import { authenticateToken } from '../middlewares/authenticateToken'
import { GetTotalUsersUseCase } from '../../domain/interfaces/use-cases/stats/get-total-users-use-case'
import { GetTotalNftsUseCase } from '../../domain/interfaces/use-cases/stats/get-total-nfts-use-case'

export default function StatsRouter(
  getTotalUsers: GetTotalUsersUseCase,
  getTotalNfts: GetTotalNftsUseCase
) {
  const router = express.Router()

  router.get(
    '/total-users',
    (req: Request, res: Response, next: NextFunction) =>
      authenticateToken(req, res, next, 'admin'),
    async (req: Request, res: Response) => {
      try {
        const totalUsers = await getTotalUsers.execute()
        logger.info('Successfully fetched total users stats', null, {
          metadata: {
            service: 'stats-router',
          },
        })
        return res.json(totalUsers)
      } catch (error: any) {
        logger.error('Error fetching total user stats: %s', error.message, {
          metadata: {
            service: 'nfts-router',
          },
        })
        return res
          .status(500)
          .send({ message: 'Error fetching total users stats' })
      }
    }
  )

  router.get(
    '/total-nfts',
    (req: Request, res: Response, next: NextFunction) =>
      authenticateToken(req, res, next, 'admin'),
    async (req: Request, res: Response) => {
      try {
        const totalNfts = await getTotalNfts.execute()
        logger.info('Successfully fetched total nfts stats', null, {
          metadata: {
            service: 'stats-router',
          },
        })
        return res.json(totalNfts)
      } catch (error: any) {
        logger.error('Error fetching total user nfts: %s', error.message, {
          metadata: {
            service: 'nfts-router',
          },
        })
        return res
          .status(500)
          .send({ message: 'Error fetching total users stats' })
      }
    }
  )

  return router
}
