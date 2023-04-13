import { RefreshTokensRequestModel } from '../../../domain/model/RefreshTokens'
import { RefreshTokensDataSource } from '../../interfaces/data-sources/RefreshTokensDataSource'

import { MongoRepository } from './MongoRepository'

export class MongoDBRefreshTokensDataSource
  extends MongoRepository
  implements RefreshTokensDataSource
{
  protected collectionName(): string {
    return 'tokens'
  }

  public async save(id: string, refreshToken: RefreshTokensRequestModel) {
    await this.persist(id, { refreshToken })
  }

  public async remove(address: string) {
    const collection = await this.collection()
    await collection.deleteMany({ address: address })
  }

  public async search(refreshToken: string): Promise<any | null> {
    const collection = await this.collection()
    const document = await collection.findOne<any>({
      'refreshToken.refreshToken': refreshToken,
    })

    return document || null
  }
}
