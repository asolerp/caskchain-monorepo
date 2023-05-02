// data/data-sources/contact-data-source.ts

import {
  TransactionHistoryRequestModel,
  TransactionHistoryResponseModel,
} from '../../../domain/model/TransactionHistory'

export interface TransactionHistoryDataSource {
  save(id: string, transaction: TransactionHistoryRequestModel): Promise<void>
  search(tokenId: string): Promise<TransactionHistoryResponseModel[] | null>
  getTransactions(): Promise<TransactionHistoryResponseModel[] | null>
  searchByTokenId(
    tokenId: string
  ): Promise<TransactionHistoryResponseModel[] | null>
  searchByWalletAddress(
    walletAddress: string
  ): Promise<TransactionHistoryResponseModel[] | null>
}
