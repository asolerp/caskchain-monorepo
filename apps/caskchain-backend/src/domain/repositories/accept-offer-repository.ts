import { OfferDataSource } from '../../data/interfaces/data-sources/OfferDataSource'
import { AcceptOfferRepository } from '../interfaces/repository/accept-offer-repository'

export class AcceptOfferImpl implements AcceptOfferRepository {
  offerDataSource: OfferDataSource
  constructor(offerDataSource: OfferDataSource) {
    this.offerDataSource = offerDataSource
  }

  async acceptOffer(tokenId: string, bidder: string) {
    await this.offerDataSource.acceptOffer(tokenId, bidder)
  }
}
