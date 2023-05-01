import { RoyaltyRepository } from '../../interfaces/repository/royalty-repository'
import { GetRoyaltiesUseCase } from '../../interfaces/use-cases/transactions/get-royalties-use-case'

export class GetRoyalties implements GetRoyaltiesUseCase {
  royaltyRepository: RoyaltyRepository
  constructor(royaltyRepository: RoyaltyRepository) {
    this.royaltyRepository = royaltyRepository
  }

  async execute() {
    const result = await this.royaltyRepository.getAllRoyalties()
    return result
  }
}
