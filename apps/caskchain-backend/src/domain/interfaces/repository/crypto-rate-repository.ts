export interface CryptoRateRepository {
  storePair(pairs: any): Promise<void>
  getRates(): Promise<number>
}
