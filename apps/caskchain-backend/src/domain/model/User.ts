export interface UserRequestModel {
  address?: string
  nickname?: string
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
