import { TransactionRepository } from '../../interfaces/repository/transaction-repository'
import { GetNFTSalesHistoryUseCase } from '../../interfaces/use-cases/sales/get-nft-sales-history-use-case'

export class GetNftSalesHistory implements GetNFTSalesHistoryUseCase {
  transactionHistoryRepository: TransactionRepository
  constructor(transactionHistoryRepository: TransactionRepository) {
    this.transactionHistoryRepository = transactionHistoryRepository
  }

  async execute(tokenId: string) {
    const result =
      await this.transactionHistoryRepository.getTransactionsByTokenId(tokenId)
    return result
  }
}
