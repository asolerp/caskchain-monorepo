import { TransactionRepository } from '../../interfaces/repository/transaction-repository'
import { GetTransactionsByWalletAddressUseCase } from '../../interfaces/use-cases/transactions/get-transaction-by-wallet-address-use-case'

export class GetTransactionByWalletAddress
  implements GetTransactionsByWalletAddressUseCase
{
  transactionHistoryRepository: TransactionRepository
  constructor(transactionHistoryRepository: TransactionRepository) {
    this.transactionHistoryRepository = transactionHistoryRepository
  }

  async execute(walletAddress: string) {
    const result =
      await this.transactionHistoryRepository.getTransactionByWalletAddress(
        walletAddress
      )
    return result
  }
}
