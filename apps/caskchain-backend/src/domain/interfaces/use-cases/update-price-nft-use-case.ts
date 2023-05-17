export interface UpdatePriceNftUseCase {
  execute(id: string, price: string): Promise<void>
}
