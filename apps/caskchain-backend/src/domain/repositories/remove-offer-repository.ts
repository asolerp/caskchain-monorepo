import { OfferDataSource } from '../../data/interfaces/data-sources/OfferDataSource'

import { RemoveOfferRepository } from '../interfaces/repository/remove-offer-repository'

export class RemoveOfferImpl implements RemoveOfferRepository {
  offerDataSource: OfferDataSource
  constructor(offerDataSource: OfferDataSource) {
    this.offerDataSource = offerDataSource
  }

  async removeOffer(tokenId: string, bidder: string) {
    await this.offerDataSource.removeOffer(tokenId, bidder)
  }
}
