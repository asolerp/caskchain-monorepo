import { AcceptOfferRepository } from '../../interfaces/repository/accept-offer-repository'
import { AcceptOfferUseCase } from '../../interfaces/use-cases/offers/accpet-offer-user-case'

export class AcceptOffer implements AcceptOfferUseCase {
  acceptOfferRepository: AcceptOfferRepository
  constructor(acceptOfferRepository: AcceptOfferRepository) {
    this.acceptOfferRepository = acceptOfferRepository
  }

  async execute(id: string, bidder: string) {
    await this.acceptOfferRepository.acceptOffer(id, bidder)
  }
}
