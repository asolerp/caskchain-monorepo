import { RoyaltyRepository } from '../../interfaces/repository/royalty-repository'
import { SaveRoyaltyUseCase } from '../../interfaces/use-cases/save-royalty-use-case'

export class SaveRoyalty implements SaveRoyaltyUseCase {
  royaltyRepository: RoyaltyRepository
  constructor(royaltyRepository: RoyaltyRepository) {
    this.royaltyRepository = royaltyRepository
  }

  async execute(id: string, royaltyInfo: any) {
    await this.royaltyRepository.saveRoyalty(id, royaltyInfo)
  }
}
