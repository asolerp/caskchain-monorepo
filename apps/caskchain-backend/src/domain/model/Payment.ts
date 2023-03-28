import { CaskProduct } from "../../types/payments";

export interface PaymentRequest {
    items: CaskProduct[];
}

export interface PaymentResponse {
    url: string;
}