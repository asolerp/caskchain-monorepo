// data/data-sources/contact-data-source.ts

import { NFTRequestModel, NFTResponseModel } from '../../../domain/model/NFT'

export interface NFTsDataSource {
  save(id: string, nft: NFTRequestModel): Promise<void>
  getNFTFavoriteCounter(id: string): Promise<number>
  updateFavoriteCounter(id: string, action: string): Promise<number>
  search(tokenId: string): Promise<NFTResponseModel[] | null>
  updateOwnerNft(id: string, owner: string): Promise<void>
  updatePrice(id: string, price: string): Promise<void>
  getAllNfts(
    page: number,
    pageSize: number,
    filter: any
  ): Promise<NFTResponseModel[]>
}
