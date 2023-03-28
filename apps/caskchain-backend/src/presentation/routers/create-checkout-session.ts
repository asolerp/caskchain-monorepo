import express from 'express'
import { Request, Response } from 'express'
import { CreateCheckoutSessionUseCase } from '../../domain/interfaces/use-cases/create-checkout-sesion'
import { RecordInitPaymentUseCase } from '../../domain/interfaces/use-cases/record-init-payment'
import { v4 as uuidv4 } from 'uuid'
import { isValidAddress } from 'ethereumjs-util'

export default function CreateCheckoutSessionRouter(
  createCheckoutSession: CreateCheckoutSessionUseCase,
  recordInitPayment: RecordInitPaymentUseCase
) {
  const router = express.Router()

  router.post('/', async (req: Request, res: Response) => {
    try {
      const { items, address, tokenId } = req.body

      if (!isValidAddress(address)) {
        throw 'Invalid ETH address'
      }

      if (items.length > 0) {
        const session = await createCheckoutSession.execute(items)

        await recordInitPayment.execute(uuidv4(), {
          paymentId: session.id,
          nft_sent: false,
          payment_status: session.payment_status,
          amount_total: session.amount_total,
          currency: session.currency,
          createt_at: new Date(),
          updated_at: new Date(),
          address,
          tokenId,
        })
        res.json({ url: session.url })
      } else {
        throw 'Cannot checkout 0 items'
      }
    } catch (err) {
      console.log(err)
      return res.status(422).send({ message: 'Cannot buy in this moment' })
    }
  })

  return router
}
