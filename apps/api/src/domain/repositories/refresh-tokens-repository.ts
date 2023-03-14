import { RefreshTokensRepository } from '../interfaces/repository/refresh-tokens.repository'
import { RefreshTokensDataSource } from '../../data/interfaces/data-sources/RefreshTokensDataSource'
import { RefreshTokensRequestModel } from '../model/RefreshTokens'

export class RefreshTokensRepositoryImpl implements RefreshTokensRepository {
  refreshTokensDataSource: RefreshTokensDataSource
  constructor(refreshTokensDataSource: RefreshTokensDataSource) {
    this.refreshTokensDataSource = refreshTokensDataSource
  }

  async getRefreshToken(refreshToken: string): Promise<string | null> {
    const result = await this.refreshTokensDataSource.search(refreshToken)
    return result
  }

  async addRefreshToken(
    id: string,
    refreshToken: RefreshTokensRequestModel
  ): Promise<void> {
    await this.refreshTokensDataSource.save(id, refreshToken)
  }

  async deleteRefreshTokens(address: string): Promise<void> {
    await this.refreshTokensDataSource.remove(address)
  }
}
