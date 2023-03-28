import { TransactionHistoryRequestModel } from "../../model/TransactionHistory";


export interface CreateTransactionUseCase {
    execute(id: string, transaction: TransactionHistoryRequestModel): Promise<void>;
}