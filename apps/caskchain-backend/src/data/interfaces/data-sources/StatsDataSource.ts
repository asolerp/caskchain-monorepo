// data/data-sources/contact-data-source.ts

export interface StatsDataSource {
  save(stat: string, action: 'increment' | 'decrement'): Promise<void>
  getTotalUsers(): Promise<void>
  incrementTotalUsers(): Promise<void>
}
