import { RefreshTokensRequestModel } from '../../model/RefreshTokens'

export interface CreateRefreshTokensUseCase {
  execute(id: string, refreshToken: RefreshTokensRequestModel): Promise<void>
}
