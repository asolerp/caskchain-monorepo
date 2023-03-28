import { PaymentRequest } from "../../model/Payment";


export interface CreateCheckoutSessionUseCase {
    execute(items: PaymentRequest): Promise<any>;
}