export interface UpdatePriceNftUseCase {
  execute(id: string, price: string, erc20Token?: string): Promise<void>
}
