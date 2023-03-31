export interface GetSentOffersUseCase {
  execute(address: string): Promise<any>
}
