export interface StatsRepository {
  getTotalUsers(): Promise<void>
  incrementTotalUsers(): Promise<void>
}
