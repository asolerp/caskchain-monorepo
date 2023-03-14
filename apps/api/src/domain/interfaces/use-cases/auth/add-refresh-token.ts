import { RefreshTokensRequestModel } from '../../../model/RefreshTokens'

export interface AddRefreshTokensUseCase {
  execute(
    id: string,
    refreshToken: RefreshTokensRequestModel
  ): Promise<string | null>
}
