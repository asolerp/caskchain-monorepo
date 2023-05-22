import { TransactionHistoryRequestModel } from '../../../domain/model/TransactionHistory'
import { TransactionHistoryDataSource } from '../../interfaces/data-sources/TransactionHistoryDataSource'
import { MongoDBUserDataSource } from './MongoDBUserDataSource'

import { MongoRepository } from './MongoRepository'

export class MongoDBTransactionHistoryDataSource
  extends MongoRepository
  implements TransactionHistoryDataSource
{
  protected collectionName(): string {
    return 'transactions'
  }

  public async save(id: string, transaction: TransactionHistoryRequestModel) {
    await this.persist(id, transaction)
  }

  public async getTransactions(
    type?: 'item-bought' | 'transfer'
  ): Promise<any | null> {
    console.log('TYPE', type)
    const collection = await this.collection()
    const document = await collection.find<any>({ type }).toArray()
    return document || null
  }

  public async search(tokenId: string): Promise<any | null> {
    const clientDB = this.client()
    const mongoUserDataSource = new MongoDBUserDataSource(clientDB)

    const collection = await this.collection()
    const document = await collection
      .find<any>({
        $and: [
          {
            tokenId: tokenId,
          },
          {
            type: { $ne: 'transfer' },
          },
        ],
      })
      .toArray()

    const documentsWithUser = await Promise.all(
      document.map(async (sale) => {
        const user = await mongoUserDataSource.search(sale.to)
        return {
          ...sale,
          to: {
            address: user.address,
            nickname: user.nickname,
          },
        }
      })
    )

    return documentsWithUser || null
  }

  public async searchByTokenId(tokenId: string): Promise<any | null> {
    const collection = await this.collection()
    const document = await collection
      .find<any>({
        tokenId: tokenId,
      })
      .toArray()
    return document || null
  }

  public async searchByWalletAddress(
    walletAddress: string
  ): Promise<any | null> {
    const collection = await this.collection()
    const document = await collection
      .find<any>({
        $and: [
          {
            $or: [{ from: walletAddress }, { to: walletAddress }],
          },
        ],
      })
      .toArray()

    return document || null
  }
}
