export interface GetNFTsUseCase {
  execute(page: number, pageSize: number, filter: any): Promise<any>
}
