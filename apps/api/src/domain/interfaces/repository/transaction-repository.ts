// domain/interfaces/repositories/contact-repository.ts
import {
  TransactionHistoryRequestModel,
  TransactionHistoryResponseModel,
} from '../../model/TransactionHistory'

export interface TransactionRepository {
  createTransaction(
    id: string,
    transaction: TransactionHistoryRequestModel
  ): Promise<void>
  getTransactions(
    tokenId: string
  ): Promise<TransactionHistoryResponseModel[] | null>
  getTransactionByWalletAddress(
    walletAddress: string
  ): Promise<TransactionHistoryResponseModel[] | null>
}
