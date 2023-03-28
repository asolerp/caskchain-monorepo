import { RefreshTokensRepository } from '../../interfaces/repository/refresh-tokens.repository'
import { AddRefreshTokensUseCase } from '../../interfaces/use-cases/auth/add-refresh-token'
import { RefreshTokensRequestModel } from '../../model/RefreshTokens'

export class AddRefreshTokens implements AddRefreshTokensUseCase {
  refreshTokensRepository: RefreshTokensRepository
  constructor(refreshTokensRepository: RefreshTokensRepository) {
    this.refreshTokensRepository = refreshTokensRepository
  }

  async execute(id: string, refreshToken: RefreshTokensRequestModel) {
    const result = await this.refreshTokensRepository.addRefreshToken(
      id,
      refreshToken
    )
    return result
  }
}
