import express from 'express'
import { Response } from 'express'

import logger from '../utils/logger'
import { GetCryptoRateUseCase } from '../../domain/interfaces/use-cases/rates/get-crypto-rate-use-case'

export default function RateRouter(getRate: GetCryptoRateUseCase) {
  const router = express.Router()

  router.get('/', async (_, res: Response) => {
    try {
      const rates = await getRate.execute()
      logger.info('Successfully retrieved rates', null, {
        metadata: {
          service: 'rate-router',
        },
      })
      return res.json(rates)
    } catch (error: any) {
      logger.error('Error retrieving rates: %s', error.message, {
        metadata: {
          service: 'rate-router',
        },
      })
      return res.status(500).send({ message: 'Error retrieving rates' })
    }
  })

  return router
}
