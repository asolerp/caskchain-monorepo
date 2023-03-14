import express, { Request, Response } from 'express'

import { GetPaymentByPaymentIdUseCase } from '../../domain/interfaces/use-cases/get-payment-by-payment-id-use-case'
import { SendBougthNFTUseCase } from '../../domain/interfaces/use-cases/send-bought-nft'
import { UpdatePaymentStatusUseCase } from '../../domain/interfaces/use-cases/update-payment-status'

export default function WebhookRouter(
  getInitPayment: GetPaymentByPaymentIdUseCase,
  sendBoughtNFT: SendBougthNFTUseCase,
  updateTransaction: UpdatePaymentStatusUseCase
) {
  const router = express.Router()

  router.post(
    '/',
    express.raw({ type: 'application/json' }),
    async (req: Request, res: Response) => {
      const stripePayload = req.body

      // Handle the checkout.session.completed event
      if (stripePayload.type === 'checkout.session.completed') {
        // Retrieve the session. If you require line items in the response, you may include them by expanding line_items.
        const session = stripePayload.data

        try {
          const payment = await getInitPayment.execute(session.object.id)
          await updateTransaction.execute(payment._id, {
            payment_status: session.object.payment_status,
            updated_at: new Date(),
          })
          await sendBoughtNFT.execute(payment.address, payment.tokenId, 0).then(
            async () =>
              await updateTransaction.execute(payment._id, {
                nft_sent: true,
              })
          )
        } catch (e: any) {
          console.log(e)
          return res.status(422).send({ message: 'Something went wrong' })
        }
      }

      res.status(200)
    }
  )

  return router
}
