import { NFTRepository } from '../../interfaces/repository/nft-repository'
import { GetTotalNftsUseCase } from '../../interfaces/use-cases/stats/get-total-nfts-use-case'

export class GetTotalNfts implements GetTotalNftsUseCase {
  web3Repository: NFTRepository
  constructor(web3Repository: NFTRepository) {
    this.web3Repository = web3Repository
  }

  async execute() {
    return await this.web3Repository.getTotalNftsSupply()
  }
}
