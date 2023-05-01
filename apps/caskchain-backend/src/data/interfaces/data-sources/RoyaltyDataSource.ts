// data/data-sources/contact-data-source.ts

import {
  RoyaltyRequestModel,
  RoyaltyResponseModel,
} from '../../../domain/model/Royalty'

export interface RoyaltyDataSource {
  save(id: string, royaltyInfo: RoyaltyRequestModel): Promise<void>
  getAllRoyalties(): Promise<RoyaltyResponseModel[] | null>
  getRoyalties(tokenId: string): Promise<RoyaltyResponseModel[] | null>
}
