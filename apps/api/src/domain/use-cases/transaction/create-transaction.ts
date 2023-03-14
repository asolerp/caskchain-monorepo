import { TransactionRepository } from "../../interfaces/repository/transaction-repository";
import { CreateTransactionUseCase } from "../../interfaces/use-cases/create-transaction-use-case";

import { TransactionHistoryRequestModel } from "../../model/TransactionHistory";


export class CreateTransaction implements CreateTransactionUseCase {
    transactionHistoryRepository: TransactionRepository
    constructor(transactionHistoryRepository: TransactionRepository) {
        this.transactionHistoryRepository = transactionHistoryRepository
    }

    async execute(id: string, transaction: TransactionHistoryRequestModel) {
        await this.transactionHistoryRepository.createTransaction(id, transaction)

    }
}