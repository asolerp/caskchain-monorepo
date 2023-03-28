import { NFTRequestModel } from '../../../domain/model/NFT'
import { NFTsDataSource } from '../../interfaces/data-sources/NFTsDataSource'

import { MongoRepository } from './MongoRepository'

export class MongoDBNFTDataSource
  extends MongoRepository
  implements NFTsDataSource
{
  protected collectionName(): string {
    return 'nfts'
  }

  public async save(id: string, nft: NFTRequestModel) {
    await this.persist(id, nft)
  }

  public async getNFTFavoriteCounter(id: string): Promise<number> {
    const collection = await this.collection()
    const document = await collection.find<any>({ _id: id }).toArray()
    return document[0]?.favorites
  }

  public async updateFavoriteCounter(
    id: string,
    action: string
  ): Promise<number> {
    const collection = await this.collection()
    await collection.updateOne(
      { _id: id },
      { $inc: { favorites: action === 'added' ? 1 : -1 } },
      { upsert: true }
    )
    const nftData = await this.search(id)
    return nftData[0].favorites
  }

  public async search(tokenId: string): Promise<any | null> {
    const collection = await this.collection()
    const document = await collection.find<any>({ _id: tokenId }).toArray()

    return document || null
  }
}
