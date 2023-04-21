import { StatsRepository } from '../../interfaces/repository/stats-repository'
import { IncrementTotalUsersUseCase } from '../../interfaces/use-cases/stats/increment-total-users-use-case'

export class IncrementTotalUsers implements IncrementTotalUsersUseCase {
  statsRepository: StatsRepository
  constructor(statsRepository: StatsRepository) {
    this.statsRepository = statsRepository
  }

  async execute() {
    return await this.statsRepository.incrementTotalUsers()
  }
}
