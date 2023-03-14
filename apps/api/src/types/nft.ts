export type Trait = 'year' | 'extraction' | 'country' | 'region'

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

export type NftCore = {
  tokenURI: string
  tokenId: number
  price?: number
  creator: string
  owner: string
  shares?: number
  totalShares?: number
}

export type ERC20Price = {
  address: string
  price: number
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
