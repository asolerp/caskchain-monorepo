import { Stripe } from "stripe";
import { PaymentsInterface } from "../interfaces/payments/PaymentsInterface";

export class StripeIntegration implements PaymentsInterface {

    private stripe: Stripe;

    constructor(stripe: Stripe) {
        this.stripe = stripe
    }

    async getEvent(payload: any, headers: any, secret: any) {
       const event = this.stripe.webhooks.constructEvent(payload, headers, secret);
       return event
    }

    async createCheckoutSession(items: Stripe.Checkout.SessionCreateParams.LineItem[] | undefined) {

        const session = await this.stripe.checkout.sessions.create({
            line_items: items,
            mode: 'payment',
            success_url: `${process.env.APP_DOMAIN}?success=true`,
            cancel_url: `${process.env.APP_DOMAIN}?canceled=true`,
        })

        return session
    };


}