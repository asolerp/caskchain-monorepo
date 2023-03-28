export interface GetRefreshTokensUseCase {
  execute(refreshToken: string): Promise<string | null>
}
