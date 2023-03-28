export interface GetNFTFavoriteCounterUseCase {
  execute(caskId: string): Promise<number>
}
