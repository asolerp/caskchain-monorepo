import { Nft } from '../../../types/nft'
import { NFTRepository } from '../../interfaces/repository/nft-repository'
import { GetBestNftsUseCase } from '../../interfaces/use-cases/casks/get-best-nfts'

export class GetBestNfts implements GetBestNftsUseCase {
  nftRepository: NFTRepository
  constructor(nftRepository: NFTRepository) {
    this.nftRepository = nftRepository
  }

  async execute(): Promise<Nft[]> {
    return await this.nftRepository.getBestNfts()
  }
}
