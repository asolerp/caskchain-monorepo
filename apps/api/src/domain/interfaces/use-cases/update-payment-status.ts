import { RecordPaymentsRequestModel } from '../../model/RecordPayments'

export interface UpdatePaymentStatusUseCase {
  execute(id: string, data: RecordPaymentsRequestModel): Promise<void>
}
