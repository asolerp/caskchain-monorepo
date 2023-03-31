export type Trait = 'year' | 'extractions' | 'country' | 'region'

export type NftAttribute = {
  trait_type: Trait
  value: string
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
  id: string
  from: string
  to: string
  date: Date
  tokenId: string
  value: string
}

export type Nft = {
  meta: NftMeta
  erc20Prices?: ERC20Price[]
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
