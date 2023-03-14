export interface PaymentsRepository {
    createCheckoutSession(items: any): Promise<any>;
}