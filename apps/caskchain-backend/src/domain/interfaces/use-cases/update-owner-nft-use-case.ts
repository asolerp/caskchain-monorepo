export interface UpdateOwnerNFTUseCase {
  execute(id: string, owner: string): Promise<void>
}
