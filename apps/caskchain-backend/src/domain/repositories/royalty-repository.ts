import { RoyaltyDataSource } from '../../data/interfaces/data-sources/RoyaltyDataSource'
import { RoyaltyRepository } from '../interfaces/repository/royalty-repository'

export class RoyaltyImpl implements RoyaltyRepository {
  royaltyDataSource: RoyaltyDataSource
  constructor(royaltyDataSource: RoyaltyDataSource) {
    this.royaltyDataSource = royaltyDataSource
  }

  async saveRoyalty(id: string, royaltyInfo: any): Promise<any> {
    this.royaltyDataSource.save(id, royaltyInfo)
  }

  async getAllRoyalties(): Promise<any> {
    const result = this.royaltyDataSource.getAllRoyalties()
    return result
  }

  async getRoyalties(tokenId: string): Promise<any> {
    const result = this.royaltyDataSource.getRoyalties(tokenId)
    return result
  }
}
