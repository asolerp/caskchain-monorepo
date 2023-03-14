export interface NFTRequestModel {
  name: string
  description: string
  image: string
  attributes: any
  value: string
  pinata: string
  owner: any
  favorites: number
}

export interface NFTResponseModel {
  id: string
  name: string
  description: string
  image: string
  attributes: any
  value: string
  pinata: string
  owner: any
}

export interface NFT {
  id: string
  name: string
  description: string
  image: string
  attributes: any
  value: string
  pinata: string
  owner: any
}
