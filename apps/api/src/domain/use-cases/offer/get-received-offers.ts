import { OfferRepository } from '../../interfaces/repository/offer-repository'
import { GetReceivedOffersUseCase } from '../../interfaces/use-cases/offers/get-received-offers'

export class GetReceivedOffers implements GetReceivedOffersUseCase {
  offerRepository: OfferRepository
  constructor(offerRepository: OfferRepository) {
    this.offerRepository = offerRepository
  }

  async execute(address: string) {
    return await this.offerRepository.getReceivedOffers(address)
  }
}
