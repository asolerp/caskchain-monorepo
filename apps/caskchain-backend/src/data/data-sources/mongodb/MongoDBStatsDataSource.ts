import { StatsDataSource } from '../../interfaces/data-sources/StatsDataSource'
import { MongoRepository } from './MongoRepository'

export class MongoDBStatsDataSource
  extends MongoRepository
  implements StatsDataSource
{
  protected collectionName(): string {
    return 'stats'
  }

  public async save(stat: string, action: 'increment' | 'decrement') {
    const collection = await this.collection()
    await collection.updateOne(
      { _id: stat },
      { $inc: { total: action === 'increment' ? 1 : -1 } }
    )
    return
  }

  public async incrementTotalUsers() {
    const collection = await this.collection()
    await collection.updateOne(
      { _id: 'users' },
      { $inc: { total: 1 } },
      { upsert: true }
    )
    return
  }

  public async getTotalUsers(): Promise<void> {
    const collection = await this.collection()
    const document = await collection.find<any>({ _id: 'users' }).toArray()

    return document[0] || null
  }
}
