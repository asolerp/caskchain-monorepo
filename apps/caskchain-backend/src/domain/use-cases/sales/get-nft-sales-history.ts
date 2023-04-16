import { NFTRepository } from '../../interfaces/repository/nft-repository'
import { GetNFTSalesHistoryUseCase } from '../../interfaces/use-cases/sales/get-nft-sales-history-use-case'

export class GetNftSalesHistory implements GetNFTSalesHistoryUseCase {
  web3Repository: NFTRepository
  constructor(web3Repository: NFTRepository) {
    this.web3Repository = web3Repository
  }

  async execute(tokenId: string) {
    const result = await this.web3Repository.getNftSalesHistory(tokenId)
    return result
  }
}
