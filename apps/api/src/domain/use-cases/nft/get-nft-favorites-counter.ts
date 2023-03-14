import { NFTRepository } from '../../interfaces/repository/nft-repository'
import { GetNFTFavoriteCounterUseCase } from '../../interfaces/use-cases/casks/get-nft-favorites-counter'

export class GetNFTFavoritesCounter implements GetNFTFavoriteCounterUseCase {
  nftRepository: NFTRepository
  constructor(nftRepository: NFTRepository) {
    this.nftRepository = nftRepository
  }

  async execute(caskId: string) {
    return await this.nftRepository.getNFTFavoriteCounter(caskId)
  }
}
