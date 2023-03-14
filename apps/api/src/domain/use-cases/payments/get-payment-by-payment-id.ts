import { RecordPaymentsRepository } from "../../interfaces/repository/record-payments";
import { GetPaymentByPaymentIdUseCase } from "../../interfaces/use-cases/get-payment-by-payment-id-use-case";


export class GetPaymentByPaymentId implements GetPaymentByPaymentIdUseCase {
    recordPaymentsRepository: RecordPaymentsRepository
    constructor(recordPaymentsRepository: RecordPaymentsRepository) {
        this.recordPaymentsRepository = recordPaymentsRepository
    }

    async execute(paymentId: string) {
      const payment = await this.recordPaymentsRepository.getInitPayment(paymentId)
      return payment
    }
}