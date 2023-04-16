import { NFTRepository } from '../../interfaces/repository/nft-repository'
import { GetNFTLatestOffersUserCase } from '../../interfaces/use-cases/offers/get-nft-latest-offers-user-case'

export class GetNFTLatestOffers implements GetNFTLatestOffersUserCase {
  web3Repository: NFTRepository
  constructor(web3Repository: NFTRepository) {
    this.web3Repository = web3Repository
  }

  async execute(tokenId: string) {
    const result = await this.web3Repository.getNftOffers(tokenId)
    return result
  }
}
