export interface GetNFTSalesHistoryUseCase {
  execute(id: string): Promise<any>
}
