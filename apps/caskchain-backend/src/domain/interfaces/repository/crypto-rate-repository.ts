export interface CryptoRateRepository {
  storePair(pairs: any): Promise<void>
  getRate(pair: string): Promise<number>
}
