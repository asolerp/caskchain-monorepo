import { NFTRepository } from '../../interfaces/repository/nft-repository'
import { NftFavoriteCounterUseCase } from '../../interfaces/use-cases/casks/nft-favorite-counter'

export class NftFavoriteCounter implements NftFavoriteCounterUseCase {
  nftRepository: NFTRepository
  constructor(nftRepository: NFTRepository) {
    this.nftRepository = nftRepository
  }

  async execute(caskId: string, action: any) {
    return await this.nftRepository.updateNFTFavoriteCounter(caskId, action)
  }
}
