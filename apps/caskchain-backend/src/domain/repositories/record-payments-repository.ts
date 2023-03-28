import { RecordPaymentsRepository } from '../interfaces/repository/record-payments'
import { RecordPaymentsDataSource } from '../../data/interfaces/data-sources/RecordPaymentsDataSource'
import { RecordPaymentsRequestModel } from '../model/RecordPayments'

export class RecordPaymentsImpl implements RecordPaymentsRepository {
  recordPaymentsDataSource: RecordPaymentsDataSource
  constructor(recordPaymentsDataSource: RecordPaymentsDataSource) {
    this.recordPaymentsDataSource = recordPaymentsDataSource
  }

  async updatePaymentStatus(
    paymentId: string,
    paymentRecord: RecordPaymentsRequestModel
  ): Promise<any> {
    this.recordPaymentsDataSource.save(paymentId, paymentRecord)
  }

  async recordInitPayment(
    paymentId: string,
    paymentRecord: RecordPaymentsRequestModel
  ): Promise<any> {
    this.recordPaymentsDataSource.save(paymentId, paymentRecord)
  }

  async getInitPayment(
    paymentId: string
  ): Promise<RecordPaymentsRequestModel | null> {
    const result = this.recordPaymentsDataSource.search(paymentId)
    return result
  }
}
