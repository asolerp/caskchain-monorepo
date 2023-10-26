import { NFTRepository } from '../../interfaces/repository/nft-repository'
import { PutNFTBestBarrelsUseCase } from '../../interfaces/use-cases/casks/put-nft-best-barrels'

export class PutNftBestBarrels implements PutNFTBestBarrelsUseCase {
  nftRepository: NFTRepository
  constructor(nftRepository: NFTRepository) {
    this.nftRepository = nftRepository
  }

  async execute(caskId: string, state: boolean) {
    return await this.nftRepository.updateNFTBestBarrels(caskId, state)
  }
}
