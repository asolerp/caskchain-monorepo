import { OfferDataSource } from '../../data/interfaces/data-sources/OfferDataSource'
import { OfferRequestModel } from '../model/Offer'
import { RecordOfferRepository } from '../interfaces/repository/record-offer-repository'

export class RecordOfferImpl implements RecordOfferRepository {
  offerDataSource: OfferDataSource
  constructor(offerDataSource: OfferDataSource) {
    this.offerDataSource = offerDataSource
  }

  async recordNewOffer(id: string, offer: OfferRequestModel) {
    await this.offerDataSource.save(id, offer)
  }
}
