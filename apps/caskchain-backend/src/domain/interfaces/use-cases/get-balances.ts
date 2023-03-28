export interface GetBalancesUseCase {
  execute(address: string): Promise<any>
}
