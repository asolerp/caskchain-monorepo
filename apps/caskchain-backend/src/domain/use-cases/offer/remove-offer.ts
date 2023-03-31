import { RemoveOfferRepository } from '../../interfaces/repository/remove-offer-repository'
import { RemoveOfferUseCase } from '../../interfaces/use-cases/offers/remove-offer-use-case'

export class RemoveOffer implements RemoveOfferUseCase {
  removeOfferRepository: RemoveOfferRepository
  constructor(removeOfferRepository: RemoveOfferRepository) {
    this.removeOfferRepository = removeOfferRepository
  }

  async execute(id: string, bidder: string) {
    await this.removeOfferRepository.removeOffer(id, bidder)
  }
}
