// data/data-sources/contact-data-source.ts

import { RefreshTokensRequestModel } from '../../../domain/model/RefreshTokens'

export interface RefreshTokensDataSource {
  save(id: string, refreshToken: RefreshTokensRequestModel): Promise<void>
  search(refreshToken: string): Promise<any>
  remove(address: string): Promise<void>
}
