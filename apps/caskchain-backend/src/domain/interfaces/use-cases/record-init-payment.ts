import { RecordPaymentsRequestModel } from "../../model/RecordPayments";

export interface RecordInitPaymentUseCase {
    execute(id: string, paymentRecord: RecordPaymentsRequestModel): Promise<any>;
}