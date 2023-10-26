import { CryptoRateRepository } from '../../interfaces/repository/crypto-rate-repository'
import { GetCryptoRateUseCase } from '../../interfaces/use-cases/rates/get-crypto-rate-use-case'

export class GetCryptoRates implements GetCryptoRateUseCase {
  constructor(private cryptoRateRepository: CryptoRateRepository) {}

  async execute(): Promise<any> {
    const rates = await this.cryptoRateRepository.getRates()
    return rates
  }
}
