export interface NftFavoriteCounterUseCase {
  execute(caskId: string, action: string): Promise<number>
}
