import { StatsDataSource } from '../../data/interfaces/data-sources/StatsDataSource'
import { StatsRepository } from '../interfaces/repository/stats-repository'

export class StatsImpl implements StatsRepository {
  statsDataSource: StatsDataSource
  constructor(statsDataSource: StatsDataSource) {
    this.statsDataSource = statsDataSource
  }

  async getTotalUsers() {
    return await this.statsDataSource.getTotalUsers()
  }

  async incrementTotalUsers() {
    await this.statsDataSource.incrementTotalUsers()
  }
}
