import express, { NextFunction } from 'express'
import { Request, Response } from 'express'

import { GetTransactionsByTokenIdUseCase } from '../../domain/interfaces/use-cases/get-transaction-by-token-id-use-case'
import { GetTransactionsByWalletAddressUseCase } from '../../domain/interfaces/use-cases/transactions/get-transaction-by-wallet-address-use-case'
import { GetNFTSalesHistoryUseCase } from '../../domain/interfaces/use-cases/sales/get-nft-sales-history-use-case'
import { GetTransactionsUseCase } from '../../domain/interfaces/use-cases/transactions/get-transactions-use-case'
import { authenticateToken } from '../middlewares/authenticateToken'
import { GetRoyaltiesUseCase } from '../../domain/interfaces/use-cases/transactions/get-royalties-use-case'

export default function TransactionsHistoryRouter(
  getNFTSalesHistory: GetNFTSalesHistoryUseCase,
  getRoyalties: GetRoyaltiesUseCase,
  getTransactions: GetTransactionsUseCase,
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

  router.get(
    '/royalties',
    (req: Request, res: Response, next: NextFunction) =>
      authenticateToken(req, res, next, 'admin'),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const royalties = await getRoyalties.execute()
        return res.json(royalties)
      } catch (error) {
        next(error)
      }
    }
  )

  router.get(
    '/sales-history/:tokenId',
    async (req: Request, res: Response, next: NextFunction) => {
      const { tokenId } = req.params
      if (!tokenId) {
        throw new Error('Token ID is required')
      }
      try {
        const salesHistory = await getNFTSalesHistory.execute(tokenId)
        return res.json(salesHistory)
      } catch (error: any) {
        next(error)
      }
    }
  )

  router.get(
    '/all',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const salesHistory = await getTransactions.execute()
        return res.json(salesHistory)
      } catch (error: any) {
        next(error)
      }
    }
  )

  return router
}
