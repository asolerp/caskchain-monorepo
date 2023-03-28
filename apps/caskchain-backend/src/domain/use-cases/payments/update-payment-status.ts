import { RecordPaymentsRepository } from '../../interfaces/repository/record-payments'
import { UpdatePaymentStatusUseCase } from '../../interfaces/use-cases/update-payment-status'
import { RecordPaymentsRequestModel } from '../../model/RecordPayments'

export class UpdatePaymentStatus implements UpdatePaymentStatusUseCase {
  recordPaymentsRepository: RecordPaymentsRepository
  constructor(recordPaymentsRepository: RecordPaymentsRepository) {
    this.recordPaymentsRepository = recordPaymentsRepository
  }

  async execute(id: string, paymentRecord: RecordPaymentsRequestModel) {
    await this.recordPaymentsRepository.updatePaymentStatus(id, paymentRecord)
  }
}
