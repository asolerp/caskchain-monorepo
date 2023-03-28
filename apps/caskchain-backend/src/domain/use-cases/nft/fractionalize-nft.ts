import { NFTRepository } from '../../interfaces/repository/nft-repository'
import { FractionalizeNftUseCase } from '../../interfaces/use-cases/fractionalize-nft'

export class FractionalizeNft implements FractionalizeNftUseCase {
  web3Repository: NFTRepository
  constructor(web3Repository: NFTRepository) {
    this.web3Repository = web3Repository
  }

  async execute(fractionInfo: any) {
    return await this.web3Repository.fractionalizeNft(fractionInfo)
  }
}
