import { OfferRequestModel } from '../../../domain/model/Offer'
import { OfferDataSource } from '../../interfaces/data-sources/OfferDataSource'

import { MongoRepository } from './MongoRepository'

export class MongoDBOfferDataSource
  extends MongoRepository
  implements OfferDataSource
{
  protected collectionName(): string {
    return 'offers'
  }

  public async save(id: string, offer: OfferRequestModel) {
    await this.persist(id, offer)
  }

  public async search(tokenId: string): Promise<any | null> {
    const collection = await this.collection()
    const document = await collection.find<any>({ tokenId: tokenId }).toArray()

    console.log('Document: ', document)

    return document || null
  }

  public async searchReceivedOffers(address: string): Promise<any | null> {
    const collection = await this.collection()
    const document = await collection.find<any>({ address: address }).toArray()
    return document || null
  }
}
