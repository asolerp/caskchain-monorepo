import { OfferRepository } from '../../interfaces/repository/offer-repository'
import { GetSentOffersUseCase } from '../../interfaces/use-cases/offers/get-sent-offers'

export class GetSentOffers implements GetSentOffersUseCase {
  offerRepository: OfferRepository
  constructor(offerRepository: OfferRepository) {
    this.offerRepository = offerRepository
  }

  async execute(address: string) {
    return await this.offerRepository.getSentOffers(address)
  }
}
