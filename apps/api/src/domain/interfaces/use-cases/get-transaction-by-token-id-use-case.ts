import { TransactionHistoryRequestModel } from "../../model/TransactionHistory";


export interface GetTransactionsByTokenIdUseCase {
    execute(id: string): Promise<TransactionHistoryRequestModel[] | null>;
}