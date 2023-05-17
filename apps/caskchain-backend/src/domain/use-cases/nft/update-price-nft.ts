import { NFTRepository } from '../../interfaces/repository/nft-repository'
import { UpdatePriceNftUseCase } from '../../interfaces/use-cases/update-price-nft-use-case'

export class UpdatePriceNft implements UpdatePriceNftUseCase {
  nftRepository: NFTRepository
  constructor(nftRepository: NFTRepository) {
    this.nftRepository = nftRepository
  }

  async execute(id: string, price: string) {
    await this.nftRepository.updatePrice(id, price)
  }
}
