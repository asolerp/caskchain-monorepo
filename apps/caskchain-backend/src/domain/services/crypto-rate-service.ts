import axios from 'axios'
import { CryptoRateServiceRepository } from '../interfaces/repository/crypto-rate-service-repository'

export class CryptoRatesServiceImpl implements CryptoRateServiceRepository {
  private readonly API_ENDPOINT =
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=100&page=1&sparkline=false'

  async fetchCryptoRates(): Promise<number> {
    try {
      const response = await axios.get(this.API_ENDPOINT)
      const filteredCrytpos = response?.data?.filter(
        (crypto: any) => crypto.symbol === 'eth' || crypto.symbol === 'matic'
      )
      return filteredCrytpos
    } catch (err) {
      console.log(err)
      throw new Error('Error fetching crypto rates')
    }
  }
}
