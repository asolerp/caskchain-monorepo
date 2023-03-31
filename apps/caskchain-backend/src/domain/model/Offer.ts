export interface OfferRequestModel {
  tokenId: string
  owner: string
  bidder: string
  bid: string
  createdAt: Date
  status: 'live' | 'canceled' | 'accepted'
}

export interface RemoveOfferRequestModel {
  tokenId: string
  bidder: string
  bid: string
}

export interface OfferResponseModel {
  id: string
  owner: string
  tokenId: string
  bidder: string
  bid: string
  createdAt: Date
  status: 'live' | 'canceled' | 'accepted'
}

export interface Offer {
  _id: string
  owner: string
  tokenId: string
  bidder: string
  bid: string
  createdAt: Date
  status: 'live' | 'canceled' | 'accepted'
}
