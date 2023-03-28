import { PaymentsRepository } from "../../interfaces/repository/payments-repository"
import { CreateCheckoutSessionUseCase } from "../../interfaces/use-cases/create-checkout-sesion"
import { PaymentRequest } from "../../model/Payment"

export class CreateCheckoutSession implements CreateCheckoutSessionUseCase {
    paymentRepository: PaymentsRepository
    constructor(paymentRepository: PaymentsRepository) {
        this.paymentRepository = paymentRepository
    }

    async execute(items: PaymentRequest) {
       const session = await this.paymentRepository.createCheckoutSession(items)
       return session
    }
}