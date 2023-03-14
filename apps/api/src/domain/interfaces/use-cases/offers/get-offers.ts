export interface GetOffersUseCase {
  execute(caskId: string): Promise<any>
}
