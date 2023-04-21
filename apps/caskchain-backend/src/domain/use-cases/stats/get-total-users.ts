import { StatsRepository } from '../../interfaces/repository/stats-repository'
import { GetTotalUsersUseCase } from '../../interfaces/use-cases/stats/get-total-users-use-case'

export class GetTotalUsers implements GetTotalUsersUseCase {
  statsRepository: StatsRepository
  constructor(statsRepository: StatsRepository) {
    this.statsRepository = statsRepository
  }

  async execute() {
    return await this.statsRepository.getTotalUsers()
  }
}
