import { NFTRepository } from '../../interfaces/repository/nft-repository'
import { GetNFTsUseCase } from '../../interfaces/use-cases/casks/get-nfts'

export class GetNFTs implements GetNFTsUseCase {
  web3Repository: NFTRepository
  constructor(web3Repository: NFTRepository) {
    this.web3Repository = web3Repository
  }

  async execute(page: number, pageSize: number) {
    return await this.web3Repository.getAllNfts(page, pageSize)
  }
}
