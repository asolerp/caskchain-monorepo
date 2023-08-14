export interface GetCryptoRateUseCase {
  execute(pair: string): Promise<any>
}
