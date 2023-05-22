export interface GetTransactionsUseCase {
  execute(type?: 'item-bought' | 'transfer'): Promise<any | null>
}
