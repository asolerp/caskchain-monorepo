import { TransactionHistoryResponseModel } from '../../model/TransactionHistory'

export interface GetTransactionsByTokenIdUseCase {
  execute(id: string): Promise<TransactionHistoryResponseModel[] | null>
}
