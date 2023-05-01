export interface SaveRoyaltyUseCase {
  execute(id: string, royaltyInfo: any): Promise<void>
}
