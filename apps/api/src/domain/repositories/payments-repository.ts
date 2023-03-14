
import { PaymentsRepository } from "../interfaces/repository/payments-repository";

import { PaymentsInterface } from "../../data/interfaces/payments/PaymentsInterface";
import Stripe from "stripe";

export class PaymentsRepositoryImpl implements PaymentsRepository {
    paymentsInterface: PaymentsInterface
    constructor(paymentsInterface: PaymentsInterface) {
        this.paymentsInterface = paymentsInterface
    }
    async createCheckoutSession(items: Stripe.Checkout.SessionCreateParams.LineItem[] | undefined) {
        const url = await this.paymentsInterface.createCheckoutSession(items)
        return url
    }
}