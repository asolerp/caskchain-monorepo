import { RefreshTokensRepository } from '../../interfaces/repository/refresh-tokens.repository'
import { GetRefreshTokensUseCase } from '../../interfaces/use-cases/auth/get-refresh-tokens'

export class GetRefreshTokens implements GetRefreshTokensUseCase {
  refreshTokensRepository: RefreshTokensRepository
  constructor(refreshTokensRepository: RefreshTokensRepository) {
    this.refreshTokensRepository = refreshTokensRepository
  }

  async execute(refreshToken: string) {
    const result = await this.refreshTokensRepository.getRefreshToken(
      refreshToken
    )
    return result
  }
}
