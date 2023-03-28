import { NFTRepository } from '../../interfaces/repository/nft-repository'
import { GetBalancesUseCase } from '../../interfaces/use-cases/get-balances'

export class GetBalances implements GetBalancesUseCase {
  nftRepository: NFTRepository
  constructor(nftRepository: NFTRepository) {
    this.nftRepository = nftRepository
  }

  async execute(address: string) {
    const result = await this.nftRepository.getBalances(address)
    return result
  }
}
