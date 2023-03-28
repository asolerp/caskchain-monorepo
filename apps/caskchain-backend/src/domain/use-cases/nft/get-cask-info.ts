import { NFTRepository } from '../../interfaces/repository/nft-repository'
import { GetCaskInfoUseCase } from '../../interfaces/use-cases/casks/get-cask-info'

export class GetCaskInfo implements GetCaskInfoUseCase {
  web3Repository: NFTRepository
  constructor(web3Repository: NFTRepository) {
    this.web3Repository = web3Repository
  }

  async execute(caskId: string) {
    return await this.web3Repository.getCaskInfo(caskId)
  }
}
