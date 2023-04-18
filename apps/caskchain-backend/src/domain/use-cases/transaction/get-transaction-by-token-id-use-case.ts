import { NFTRepository } from '../../interfaces/repository/nft-repository'
import { GetTransactionsByTokenIdUseCase } from '../../interfaces/use-cases/get-transaction-by-token-id-use-case'

export class GetTransactionByTokenId
  implements GetTransactionsByTokenIdUseCase
{
  web3Repository: NFTRepository
  constructor(web3Repository: NFTRepository) {
    this.web3Repository = web3Repository
  }

  async execute(tokenId: string) {
    const result = await this.web3Repository.getNftTransfers(tokenId)
    return result
  }
}
