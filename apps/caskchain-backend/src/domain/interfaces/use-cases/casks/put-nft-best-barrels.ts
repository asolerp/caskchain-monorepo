export interface PutNFTBestBarrelsUseCase {
  execute(caskId: string, state: boolean): Promise<void>
}
