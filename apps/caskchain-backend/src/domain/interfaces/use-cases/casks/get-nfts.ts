import { SortType } from '../../../../types/filters'

export interface GetNFTsUseCase {
  execute(
    page: number,
    pageSize: number,
    filter: any,
    sort: SortType
  ): Promise<any>
}
