// domain/interfaces/repositories/contact-repository.ts
import {
  TransactionHistoryRequestModel,
  TransactionHistoryResponseModel,
} from '../../model/TransactionHistory'

export interface TransactionRepository {
  getTransactions(): Promise<any | null>
  createTransaction(
    id: string,
    transaction: TransactionHistoryRequestModel
  ): Promise<void>
  getTransactionsByTokenId(
    tokenId: string
  ): Promise<TransactionHistoryResponseModel[] | null>
  getTransactionByWalletAddress(
    walletAddress: string
  ): Promise<TransactionHistoryResponseModel[] | null>
}
