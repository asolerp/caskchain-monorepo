import { NFTRequestModel } from '../../../domain/model/NFT'
import { NFTsDataSource } from '../../interfaces/data-sources/NFTsDataSource'
import { MongoDBStatsDataSource } from './MongoDBStatsDataSource'

import { MongoRepository } from './MongoRepository'
import normalizeString from './utils/normalizeString'

export class MongoDBNFTDataSource
  extends MongoRepository
  implements NFTsDataSource
{
  protected collectionName(): string {
    return 'nfts'
  }

  public async addFraction(id: string, fraction: any): Promise<void> {
    const collection = await this.collection()
    await collection.updateOne({ _id: id }, { $set: { fraction } })
  }

  public async save(id: string, nft: NFTRequestModel) {
    const clientDB = this.client()
    const mongoStatsDataSource = new MongoDBStatsDataSource(clientDB)

    const normalizedNFT = {
      ...nft,
      attributes: {
        ...nft.attributes,
        liquor: normalizeString(nft.attributes.liquor),
        distillery: normalizeString(nft.attributes.distillery),
        type: normalizeString(nft.attributes.type),
        cask_wood: normalizeString(nft.attributes.cask_wood),
        country: normalizeString(nft.attributes.country),
        region: normalizeString(nft.attributes.region),
        flavor: normalizeString(nft.attributes.flavor),
        rarity: normalizeString(nft.attributes.rarity),
      },
    }

    await this.persist(id, normalizedNFT)

    const liquor = normalizeString(nft.attributes.liquor)

    const traitValues = {
      age: nft.attributes.age,
      distillery: normalizeString(nft.attributes.distillery),
      type: normalizeString(nft.attributes.type),
      cask_wood: normalizeString(nft.attributes.cask_wood),
      cask_size: nft.attributes.cask_size,
      country: normalizeString(nft.attributes.country),
      region: normalizeString(nft.attributes.region),
      abv: nft.attributes.abv,
      rarity: normalizeString(nft.attributes.rarity),
      flavor: normalizeString(nft.attributes.flavor),
      liquor,
    }

    await mongoStatsDataSource.incrementBarrelsStats(liquor, traitValues)
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
      { $set: { owner: { address: owner }, price: 0 } }
    )
  }

  public async updatePrice(id: string, price: string): Promise<void> {
    const collection = await this.collection()
    await collection.updateOne({ _id: id }, { $set: { price: price } })
  }

  public async updateSaleState(id: string, state: boolean): Promise<void> {
    const collection = await this.collection()
    await collection.updateOne({ _id: id }, { $set: { active: state } })
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

  public async getBestNfts(): Promise<any> {
    const collection = await this.collection()
    const document = await collection.find<any>({ offer: true }).toArray()
    return document || null
  }

  public async getAllNfts(
    page: number,
    pagesize: number,
    filter: any,
    sort: any
  ): Promise<any> {
    const aggregates = []

    const collection = await this.collection()

    const count = await collection.countDocuments()
    const totalPages = count > 0 ? Math.ceil(count / pagesize) : 0
    const currentPage = totalPages ? Math.min(page, totalPages) : 0

    aggregates.push({ $match: { ...filter } })

    if (Object.keys(sort).length > 0) {
      aggregates.push({
        $sort: {
          [`attributes.${Object.keys(sort)[0]}`]: Object.values(sort)[0],
        },
      })
    }

    if (count > 0) {
      aggregates.push({ $skip: (currentPage - 1) * pagesize })
    }

    aggregates.push({ $limit: pagesize })

    const query = await collection.aggregate(aggregates)

    const documents = await query.toArray()

    return {
      documents,
      paging: {
        totalPages,
        currentPage,
        pageSize: pagesize,
        totalCount: documents.length,
      },
    }
  }
}
