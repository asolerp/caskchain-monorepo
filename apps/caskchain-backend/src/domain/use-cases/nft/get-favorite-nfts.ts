import { NFTRepository } from '../../interfaces/repository/nft-repository'
import { GetFavoriteNftsUseCase } from '../../interfaces/use-cases/casks/get-favorite-nfts'

export class GetFavoriteNfts implements GetFavoriteNftsUseCase {
  web3Repository: NFTRepository
  constructor(web3Repository: NFTRepository) {
    this.web3Repository = web3Repository
  }

  async execute(caskId: string) {
    return await this.web3Repository.getFavoriteNfts(caskId)
  }
}
