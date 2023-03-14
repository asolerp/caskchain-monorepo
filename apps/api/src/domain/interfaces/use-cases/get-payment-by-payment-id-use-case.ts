export interface GetPaymentByPaymentIdUseCase {
    execute(paymentId: string): Promise<any | null>;
}