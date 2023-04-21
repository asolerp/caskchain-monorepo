import { ChangeStream } from 'mongodb'
import { MongoRepository } from './MongoRepository'
import { IMongoDBWatcherDataSource } from '../../interfaces/data-sources/IMongoDBWatcherDataSource'

export class MongoDBUsersWatcher
  extends MongoRepository
  implements IMongoDBWatcherDataSource
{
  private changeStream: ChangeStream | null = null

  protected collectionName(): string {
    return 'users'
  }

  async watchCollection(callback: (event: any) => void) {
    const targetCollection = this.collection()

    this.changeStream = (await targetCollection).watch()
    this.changeStream?.on('change', callback)
  }

  close() {
    this.changeStream?.close()
  }
}
