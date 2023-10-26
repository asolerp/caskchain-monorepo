export interface UserRequestModel {
  [key: string]: any
  address?: string
  nickname?: string
  imageProfile?: string
  resume?: string
  email?: string
  nonce?: string | Buffer
  favorites?: any
}

export interface UserResponseModel {
  _id: string
  address: string
  nickname: string
  email: string
  nonce: string | Buffer
}

export interface User {
  id: string
  address: string
  nickname: string
  email: string
  nonce: string | Buffer
}
