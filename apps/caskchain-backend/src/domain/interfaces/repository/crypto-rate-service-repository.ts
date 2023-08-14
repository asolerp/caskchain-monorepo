export interface CryptoRateServiceRepository {
  fetchCryptoRates(): Promise<number>
}
