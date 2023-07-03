export interface StatsRepository {
  getTotalUsers(): Promise<void>
  getFilters(): Promise<void>
  incrementTotalUsers(): Promise<void>
}
