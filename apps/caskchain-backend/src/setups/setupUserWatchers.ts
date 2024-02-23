import { MongoDBStatsDataSource } from '../data/data-sources/mongodb/MongoDBStatsDataSource'
import { StatsImpl } from '../domain/repositories/stats-repository'
import { IncrementTotalUsers } from '../domain/use-cases/stats/increment-total-users'
import UserDBWatcher from '../presentation/watchers/user-db-watcher'

export const setupUserWatchers = (usersWatcher: any, clientDB: any) => {
  const { incrementTotalUsers } = UserDBWatcher(
    new IncrementTotalUsers(new StatsImpl(new MongoDBStatsDataSource(clientDB)))
  )

  usersWatcher.watchCollection(async (event: any) => {
    if (event.operationType === 'update') {
      if (event.updateDescription.updatedFields?.email !== undefined) {
        await incrementTotalUsers()
      }
    }
  })
}
