import { CryptoRatesDataSource } from '../../data/interfaces/data-sources/CryptoRatesDataSource'
import { CryptoRateRepository } from '../interfaces/repository/crypto-rate-repository'

export class CryptoRateRepositoryImpl implements CryptoRateRepository {
  cryptoRatesDataSource: CryptoRatesDataSource
  constructor(cryptoRatesDataSource: CryptoRatesDataSource) {
    this.cryptoRatesDataSource = cryptoRatesDataSource
  }

  async storePair(pairs: any): Promise<void> {
    await this.cryptoRatesDataSource.save(pairs)
  }

  async getRate(pair: string): Promise<number> {
    return await this.cryptoRatesDataSource.getRate(pair)
  }
}
