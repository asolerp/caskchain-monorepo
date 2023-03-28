// data/data-sources/contact-data-source.ts

import { NFTRequestModel, NFTResponseModel } from '../../../domain/model/NFT'

export interface NFTsDataSource {
  save(id: string, nft: NFTRequestModel): Promise<void>
  getNFTFavoriteCounter(id: string): Promise<number>
  updateFavoriteCounter(id: string, action: string): Promise<number>
  search(tokenId: string): Promise<NFTResponseModel[] | null>
}