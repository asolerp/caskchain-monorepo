import { FetchCryptoRateUseCase } from '../../interfaces/use-cases/rates/fetch-crytpo-rate-use-case'
import { CryptoRateRepository } from '../../interfaces/repository/crypto-rate-repository'
import { CryptoRateServiceRepository } from '../../interfaces/repository/crypto-rate-service-repository'

export class FetchCryptoRate implements FetchCryptoRateUseCase {
  constructor(
    private cryptoRateRepository: CryptoRateRepository,
    private cryptoRateService: CryptoRateServiceRepository
  ) {}

  async execute(): Promise<any> {
    const rates = await this.cryptoRateService.fetchCryptoRates()
    await this.cryptoRateRepository.storePair(rates)
  }
}
