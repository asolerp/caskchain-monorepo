export interface RoyaltyRequestModel {
  tokenId?: string
  royalty?: number
}

export interface RoyaltyResponseModel {
  id: string
  tokenId?: string
  royalty?: number
}

export interface Royalty {
  _id: string
  tokenId?: string
  royalty?: number
}
