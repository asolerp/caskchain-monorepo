export type Trait = 'year' | 'extractions' | 'country' | 'region'

export type NftAttribute = {
  trait_type: Trait
  value: string
}

export type NftsPaginated = {
  totalItems: string | undefined
  totalPages: number
  currentPage: number
  items: Nft[]
}

export type NftMeta = {
  name: string
  description: string
  image: string
  attributes: NftAttribute[]
}

export type NftOwner = {
  address: string
  nickname: string
}

export type NftCore = {
  tokenURI: string
  tokenId: number
  price?: number
  creator: string
  owner: NftOwner
  shares?: number
  totalShares?: number
}

export type ERC20Price = {
  address: string
  price: number
}

export type FractionHolders = {
  address: string
  balance: number
}

export type FractionBalance = {
  address: string
  name: string
  symbol: string
  balance: number
  canRedem: boolean
}

type Bidder = {
  address: string
  nickname: string
}

export type LatestOffers = {
  bid: number
  bidder: Bidder
  createdAt: Date
  txHash: string
}

export type Offers = {
  id: string
  bidder: string
  createdAt: any
  owner: string
  bid: number
  tokenId: string
  status: string
}

export type TransactionHistory = {
  _id?: string
  from: string
  to: Bidder
  date: Date
  tokenId?: string
  txHash: string
  value?: string
}

export type Nft = {
  meta: NftMeta
  erc20Prices?: any
  transactions?: TransactionHistory[]
  fractions?: any
  bidders?: string[]
  offer?: any
} & NftCore

export type FileReq = {
  bytes: Uint8Array
  contentType: string
  fileName: string
}

export type PinataRes = {
  IpfsHash: string
  PinSize: number
  Timestamp: string
  isDuplicate: boolean
}
