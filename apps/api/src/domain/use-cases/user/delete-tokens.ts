import { RefreshTokensRepository } from '../../interfaces/repository/refresh-tokens.repository'
import { DeleteTokensUseCase } from '../../interfaces/use-cases/auth/delete-tokens'

export class DeleteTokens implements DeleteTokensUseCase {
  refreshTokensRepository: RefreshTokensRepository
  constructor(refreshTokensRepository: RefreshTokensRepository) {
    this.refreshTokensRepository = refreshTokensRepository
  }

  async execute(address: string) {
    await this.refreshTokensRepository.deleteRefreshTokens(address)
  }
}
