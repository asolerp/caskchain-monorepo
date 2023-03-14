export interface DeleteTokensUseCase {
  execute(address: string): Promise<void>
}
