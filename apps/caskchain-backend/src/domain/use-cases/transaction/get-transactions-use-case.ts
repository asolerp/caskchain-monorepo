import { TransactionRepository } from '../../interfaces/repository/transaction-repository'
import { GetTransactionsUseCase } from '../../interfaces/use-cases/transactions/get-transactions-use-case'

export class GetTransactions implements GetTransactionsUseCase {
  transactionHistoryRepository: TransactionRepository
  constructor(transactionHistoryRepository: TransactionRepository) {
    this.transactionHistoryRepository = transactionHistoryRepository
  }

  async execute(type?: 'item-bought' | 'transfer') {
    return await this.transactionHistoryRepository.getTransactions(type)
  }
}
