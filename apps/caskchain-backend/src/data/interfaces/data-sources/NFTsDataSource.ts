// data/data-sources/contact-data-source.ts

import { NFTRequestModel, NFTResponseModel } from '../../../domain/model/NFT'

export interface NFTsDataSource {
  addFraction(id: string, fraction: any): Promise<void>
  save(id: string, nft: NFTRequestModel): Promise<void>
  getNFTFavoriteCounter(id: string): Promise<number>
  updateFavoriteCounter(id: string, action: string): Promise<number>
  search(tokenId: string): Promise<NFTResponseModel[] | null>
  updateOwnerNft(id: string, owner: string): Promise<void>
  updatePrice(id: string, price: string): Promise<void>
  updateSaleState(id: string, state: boolean): Promise<void>
  getBestNfts(): Promise<NFTResponseModel[]>
  getAllNfts(
    page: number,
    pageSize: number,
    filter: any,
    sort?: {
      sortBy: string
      sortOrder: string
    }
  ): Promise<NFTResponseModel[]>
}
