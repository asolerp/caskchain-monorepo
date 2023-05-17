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

  public async updateOwnerNft(id: string, owner: string): Promise<void> {
    const collection = await this.collection()
    await collection.updateOne(
      { _id: id },
      { $set: { owner: { address: owner } } }
    )
  }

  public async updatePrice(id: string, price: string): Promise<void> {
    const collection = await this.collection()
    await collection.updateOne({ _id: id }, { $set: { price: price } })
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

  public async getAllNfts(
    page: number,
    pagesize: number,
    filter: any
  ): Promise<any> {
    const collection = await this.collection()

    const count = await collection.countDocuments()
    const totalPages = Math.ceil(count / pagesize)
    const currentPage = Math.min(page, totalPages)

    console.log('FILTER', filter)

    const documents = await collection
      .find<any>(filter)
      .skip((currentPage - 1) * pagesize)
      .limit(pagesize)
      .toArray()

    return {
      documents,
      paging: {
        totalPages,
        currentPage,
        pageSize: pagesize,
        totalCount: count,
      },
    }
  }
}
