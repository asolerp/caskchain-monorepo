import axios from 'axios'
import { CryptoRateServiceRepository } from '../interfaces/repository/crypto-rate-service-repository'

export class CryptoRatesServiceImpl implements CryptoRateServiceRepository {
  private readonly API_ENDPOINT = 'https://data.binance.com/api/v3/ticker/24hr'

  async fetchCryptoRates(): Promise<number> {
    try {
      const response = await axios.get(this.API_ENDPOINT)
      const filteredCrytpos = response.data.filter(
        (crypto: any) =>
          crypto.symbol === 'ETHEUR' || crypto.symbol === 'MATICEUR'
      )
      console.log(filteredCrytpos)
      return filteredCrytpos
    } catch (err) {
      console.log(err)
      throw new Error('Error fetching crypto rates')
    }
  }
}
