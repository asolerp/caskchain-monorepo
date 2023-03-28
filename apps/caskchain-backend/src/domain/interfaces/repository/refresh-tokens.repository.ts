import { RefreshTokensRequestModel } from '../../model/RefreshTokens'

export interface RefreshTokensRepository {
  getRefreshToken(refreshToken: string): Promise<string | null>
  addRefreshToken(
    id: string,
    refreshToken: RefreshTokensRequestModel
  ): Promise<any>
  deleteRefreshTokens(address: string): Promise<any>
}
