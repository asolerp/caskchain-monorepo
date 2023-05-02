import { TransactionRepository } from '../../interfaces/repository/transaction-repository'
import { GetTransactionsByTokenIdUseCase } from '../../interfaces/use-cases/get-transaction-by-token-id-use-case'

export class GetTransactionByTokenId
  implements GetTransactionsByTokenIdUseCase
{
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
