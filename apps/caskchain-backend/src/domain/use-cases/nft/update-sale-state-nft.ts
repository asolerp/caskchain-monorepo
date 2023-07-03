import { NFTRepository } from '../../interfaces/repository/nft-repository'
import { UpdateSaleStateUseCase } from '../../interfaces/use-cases/update-sale-state-use-case'

export class UpdateSaleStateNft implements UpdateSaleStateUseCase {
  nftRepository: NFTRepository
  constructor(nftRepository: NFTRepository) {
    this.nftRepository = nftRepository
  }

  async execute(id: string, state: boolean) {
    await this.nftRepository.updateSaleState(id, state)
  }
}
