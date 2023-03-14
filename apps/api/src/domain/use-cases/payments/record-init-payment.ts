import { RecordPaymentsRepository } from "../../interfaces/repository/record-payments";
import { RecordInitPaymentUseCase } from "../../interfaces/use-cases/record-init-payment";
import { RecordPaymentsRequestModel } from "../../model/RecordPayments";




export class RecordInitPayment implements RecordInitPaymentUseCase {
    recordPaymentsRepository: RecordPaymentsRepository
    constructor(recordPaymentsRepository: RecordPaymentsRepository) {
        this.recordPaymentsRepository = recordPaymentsRepository
    }

    async execute(id: string, paymentRecord: RecordPaymentsRequestModel) {
        await this.recordPaymentsRepository.recordInitPayment(id, paymentRecord)

    }
}