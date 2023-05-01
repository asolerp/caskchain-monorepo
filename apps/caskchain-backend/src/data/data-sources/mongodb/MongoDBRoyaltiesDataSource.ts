import { RoyaltyResponseModel } from '../../../domain/model/Royalty'
import { RoyaltyDataSource } from '../../interfaces/data-sources/RoyaltyDataSource'
import { MongoRepository } from './MongoRepository'

export class MongoDBRoyaltyDataSource
  extends MongoRepository
  implements RoyaltyDataSource
{
  protected collectionName(): string {
    return 'royalties'
  }

  public async save(id: string, royaltyInfo: any) {
    await this.persist(id, royaltyInfo)
  }

  public async getAllRoyalties(): Promise<RoyaltyResponseModel[] | null> {
    const collection = await this.collection()
    const document = await collection.find().toArray()
    return document as any
  }

  public async getRoyalties(
    tokenId: string
  ): Promise<RoyaltyResponseModel[] | null> {
    const collection = await this.collection()
    const document = await collection.find<any>({ tokenId }).toArray()

    return document
  }
}
