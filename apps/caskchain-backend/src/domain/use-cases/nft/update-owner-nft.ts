import { NFTRepository } from '../../interfaces/repository/nft-repository'
import { UpdateOwnerNFTUseCase } from '../../interfaces/use-cases/update-owner-nft-use-case'

export class UpdateOwnerNft implements UpdateOwnerNFTUseCase {
  nftRepository: NFTRepository
  constructor(nftRepository: NFTRepository) {
    this.nftRepository = nftRepository
  }

  async execute(id: string, owner: string) {
    await this.nftRepository.updateOwnerNft(id, owner)
  }
}
