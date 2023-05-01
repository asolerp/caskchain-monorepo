import { RoyaltyResponseModel } from '../../model/Royalty'

export interface RoyaltyRepository {
  saveRoyalty(id: string, royaltyInfo: any): Promise<any>
  getAllRoyalties(): Promise<RoyaltyResponseModel[]>
  getRoyalties(tokenId: string): Promise<RoyaltyResponseModel[]>
}
