import { NFTRepository } from '../../interfaces/repository/nft-repository'
import { NewFractionUseCase } from '../../interfaces/use-cases/new-fraction-use-case'
import { NFTRequestModel } from '../../model/NFT'

export class NewFraction implements NewFractionUseCase {
  nftRepository: NFTRepository
  constructor(nftRepository: NFTRepository) {
    this.nftRepository = nftRepository
  }

  async execute(id: string, nft: NFTRequestModel) {
    await this.nftRepository.addFraction(id, nft)
  }
}
