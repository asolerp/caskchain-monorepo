import { OfferRepository } from '../../interfaces/repository/offer-repository'
import { GetNFTLatestOffersUserCase } from '../../interfaces/use-cases/offers/get-nft-latest-offers-user-case'

export class GetNFTLatestOffers implements GetNFTLatestOffersUserCase {
  offerRepository: OfferRepository
  constructor(offerRepository: OfferRepository) {
    this.offerRepository = offerRepository
  }

  async execute(tokenId: string) {
    return await this.offerRepository.getReceivedOffers(tokenId)
  }
}
