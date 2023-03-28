export interface PaymentsInterface {
    createCheckoutSession: (items: any) => Promise<any>;
    getEvent: (payload: any, headers: any, secret: any) => Promise<any>;
}

