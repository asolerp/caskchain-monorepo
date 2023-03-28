export interface OfferRequestModel {
  tokenId: string
  bidder: string
  bid: string
}

export interface OfferResponseModel {
  id: string
  tokenId: string
  bidder: string
  bid: string
}

export interface Offer {
  _id: string
  tokenId: string
  bidder: string
  bid: string
}
