import Stripe from 'stripe';

const stripe = new Stripe('sk_test_6Jj1ajFreI9PU7OT3rHUyN71003utJYBTE',{
    apiVersion: '2022-11-15',
});

import { StripeIntegration } from "./StripeIntegration"

export const stripeConnection = () => {
    return new StripeIntegration(stripe)
}