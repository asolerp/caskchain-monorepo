export interface GetReceivedOffersUseCase {
  execute(caskId: string): Promise<any>
}
