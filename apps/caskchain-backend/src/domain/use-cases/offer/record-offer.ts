import { RecordOfferRepository } from '../../interfaces/repository/record-offer-repository'
import { RecordNewOfferUseCase } from '../../interfaces/use-cases/record-new-offer-use-case'
import { OfferRequestModel } from '../../model/Offer'

export class RecordOffer implements RecordNewOfferUseCase {
  offerRepository: RecordOfferRepository
  constructor(offerRepository: RecordOfferRepository) {
    this.offerRepository = offerRepository
  }

  async execute(id: string, offer: OfferRequestModel) {
    await this.offerRepository.recordNewOffer(id, offer)
  }
}
