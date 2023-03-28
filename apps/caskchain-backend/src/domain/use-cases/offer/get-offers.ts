import { OfferRepository } from '../../interfaces/repository/offer-repository'
import { GetOffersUseCase } from '../../interfaces/use-cases/offers/get-offers'

export class GetOffers implements GetOffersUseCase {
  offerRepository: OfferRepository
  constructor(offerRepository: OfferRepository) {
    this.offerRepository = offerRepository
  }

  async execute(caskId: string) {
    return await this.offerRepository.getOffers(caskId)
  }
}
