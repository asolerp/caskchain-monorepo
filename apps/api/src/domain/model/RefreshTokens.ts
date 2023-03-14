export interface RefreshTokensRequestModel {
  address: string
  refreshToken: string
}

export interface RefreshTokensResponseModel {
  id: string
  address: string
  refreshToken: string
}

export interface RefreshTokens {
  _id: string
  address: string
  refreshToken: string
}
