import { TransactionHistoryResponseModel } from '../../../model/TransactionHistory'

export interface GetTransactionsByWalletAddressUseCase {
  execute(
    walletAddress: string
  ): Promise<TransactionHistoryResponseModel[] | null>
}
