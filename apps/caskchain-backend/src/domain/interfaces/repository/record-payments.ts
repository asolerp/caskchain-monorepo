import { RecordPaymentsRequestModel } from '../../model/RecordPayments'

export interface RecordPaymentsRepository {
  recordInitPayment(
    id: string,
    paymentRecord: RecordPaymentsRequestModel
  ): Promise<any>
  getInitPayment(paymentId: string): Promise<RecordPaymentsRequestModel | null>
  updatePaymentStatus(
    id: string,
    paymentRecord: RecordPaymentsRequestModel
  ): Promise<any>
}
