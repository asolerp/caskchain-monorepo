import { Nft } from '../../../types/nft'
import { NFTRepository } from '../../interfaces/repository/nft-repository'
import { GetOwnedNftsUseCase } from '../../interfaces/use-cases/casks/get-owned-nfts'

export class GetOwnedNFTs implements GetOwnedNftsUseCase {
  web3Repository: NFTRepository
  constructor(web3Repository: NFTRepository) {
    this.web3Repository = web3Repository
  }

  async execute(owwner: string): Promise<Nft[]> {
    return await this.web3Repository.getOwnedNfts(owwner)
  }
}
