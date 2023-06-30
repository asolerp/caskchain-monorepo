export interface UpdateSaleStateUseCase {
  execute(id: string, state: boolean): Promise<void>
}
