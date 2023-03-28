// data/data-sources/contact-data-source.ts

import { RecordPaymentsRequestModel, RecordPaymentsResponseModel } from "../../../domain/model/RecordPayments";

export interface RecordPaymentsDataSource {
    save(id: string, paymentRecord: RecordPaymentsRequestModel): Promise<void>;
    search(paymentId: string): Promise<RecordPaymentsResponseModel | null>;

}