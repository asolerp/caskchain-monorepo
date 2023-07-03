import { StatsRepository } from '../../interfaces/repository/stats-repository'
import { GetFiltersUseCase } from '../../interfaces/use-cases/stats/get-filters-use-case'

export class GetFilters implements GetFiltersUseCase {
  statsRepository: StatsRepository
  constructor(statsRepository: StatsRepository) {
    this.statsRepository = statsRepository
  }

  async execute() {
    return await this.statsRepository.getFilters()
  }
}
