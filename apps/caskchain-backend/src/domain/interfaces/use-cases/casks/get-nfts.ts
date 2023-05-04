export interface GetNFTsUseCase {
  execute(page: number, pageSize: number): Promise<any>
}
