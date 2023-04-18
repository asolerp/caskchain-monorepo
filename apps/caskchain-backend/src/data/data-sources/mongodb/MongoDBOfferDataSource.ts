import { OfferRequestModel } from '../../../domain/model/Offer'
import { OfferDataSource } from '../../interfaces/data-sources/OfferDataSource'
import { MongoDBUserDataSource } from './MongoDBUserDataSource'

import { MongoRepository } from './MongoRepository'

export class MongoDBOfferDataSource
  extends MongoRepository
  implements OfferDataSource
{
  protected collectionName(): string {
    return 'offers'
  }

  public async save(id: string, offer: OfferRequestModel) {
    const collection = await this.collection()
    const oldOffer = await collection
      .find<any>({
        $and: [
          {
            tokenId: offer.tokenId,
          },
          {
            bidder: offer.bidder,
          },
        ],
      })
      .toArray()

    if (oldOffer.length > 0) {
      await collection.updateOne(
        { _id: oldOffer[0]._id },
        { $set: { status: 'canceled' } }
      )
    }

    await this.persist(id, offer)
  }

  public async search(tokenId: string): Promise<any | null> {
    const clientDB = this.client()
    const mongoUserDataSource = new MongoDBUserDataSource(clientDB)

    const collection = await this.collection()

    const document = await collection.find<any>({ tokenId: tokenId }).toArray()

    const documentsWithUser = await Promise.all(
      document.map(async (offer) => {
        const user = await mongoUserDataSource.search(offer.bidder)
        return {
          ...offer,
          bidder: {
            address: user.address,
            nickname: user.nickname,
          },
        }
      })
    )

    return documentsWithUser || null
  }

  public async searchSentOffers(address: string): Promise<any | null> {
    const collection = await this.collection()
    const document = await collection
      .find<any>({ bidder: address })
      .sort({ createdAt: -1 })
      .toArray()
    return document || null
  }

  public async searchReceivedOffers(address: string): Promise<any | null> {
    const collection = await this.collection()
    const document = await collection
      .find<any>({ owner: address })
      .sort({ status: -1 })
      .toArray()
    return document || null
  }

  public async acceptOffer(tokenId: string, bidder: string) {
    const collection = await this.collection()
    const offer = await collection
      .find<any>({
        $and: [
          {
            tokenId: tokenId,
          },
          {
            bidder: bidder,
          },
        ],
      })
      .sort({ createdAt: -1 })
      .toArray()

    if (offer.length > 0) {
      await collection.updateOne(
        { _id: offer[0]._id },
        { $set: { status: 'accepted' } }
      )
    }
    return
  }

  public async removeOffer(tokenId: string, bidder: string) {
    const collection = await this.collection()
    const offer = await collection
      .find<any>({
        $and: [
          {
            tokenId: tokenId,
          },
          {
            bidder: bidder,
          },
        ],
      })
      .sort({ createdAt: -1 })
      .toArray()

    if (offer.length > 0) {
      await collection.updateOne(
        { _id: offer[0]._id },
        { $set: { status: 'canceled' } }
      )
    }
    return
  }
}
