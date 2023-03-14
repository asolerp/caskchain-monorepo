import {
  RecordPaymentsRequestModel,
  RecordPaymentsResponseModel,
} from '../../../domain/model/RecordPayments'
import { RecordPaymentsDataSource } from '../../interfaces/data-sources/RecordPaymentsDataSource'
import { MongoRepository } from './MongoRepository'

export class MongoDBRecordPaymentsDataSource
  extends MongoRepository
  implements RecordPaymentsDataSource
{
  protected collectionName(): string {
    return 'payments'
  }

  public async save(id: string, paymentRecord: RecordPaymentsRequestModel) {
    await this.persist(id, paymentRecord)
  }

  public async search(
    paymentId: string
  ): Promise<RecordPaymentsResponseModel | null> {
    const collection = await this.collection()
    const document = await collection
      .find<any>({ paymentId: paymentId })
      .toArray()

    return document[0] || null
  }
}
