import { OfferDataSource } from '../../data/interfaces/data-sources/OfferDataSource'
import { OfferRepository } from '../interfaces/repository/offer-repository'

export class OfferImpl implements OfferRepository {
  offerDataSource: OfferDataSource
  constructor(offerDataSource: OfferDataSource) {
    this.offerDataSource = offerDataSource
  }

  async getOffers(caskId: string) {
    return await this.offerDataSource.search(caskId)
  }

  async getSentOffers(address: string): Promise<any> {
    return await this.offerDataSource.searchSentOffers(address)
  }

  async getReceivedOffers(address: string) {
    return await this.offerDataSource.searchReceivedOffers(address)
  }
}
