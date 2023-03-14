import express from 'express'
import { Request, Response } from 'express'

import { GetTransactionsByTokenIdUseCase } from '../../domain/interfaces/use-cases/get-transaction-by-token-id-use-case'
import { GetTransactionsByWalletAddressUseCase } from '../../domain/interfaces/use-cases/transactions/get-transaction-by-wallet-address-use-case'

export default function TransactionsHistoryRouter(
  getTransactionsByTokenId: GetTransactionsByTokenIdUseCase,
  getTransactionByWalletAddress: GetTransactionsByWalletAddressUseCase
) {
  const router = express.Router()

  router.get('/', async (req: Request, res: Response) => {
    try {
      const tokenId = req.query?.tokenId as string
      const wallet_address = req.query?.wallet_address as string

      if (wallet_address) {
        const transactions = await getTransactionByWalletAddress.execute(
          wallet_address
        )
        return res.json(transactions)
      }
      if (tokenId) {
        const transactions = await getTransactionsByTokenId.execute(tokenId)
        return res.json(transactions)
      } else {
        throw 'Token id is necessary'
      }
    } catch {
      return res.status(422).send({ message: 'Cannot get transaction history' })
    }
  })

  return router
}
