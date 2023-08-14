import { CryptoRateServiceRepository } from '../interfaces/repository/crypto-rate-service-repository'

export class RateServiceRepositoryImpl implements CryptoRateServiceRepository {
  async fetchCryptoRates(): Promise<number> {
    return await this.fetchCryptoRates()
  }
}
