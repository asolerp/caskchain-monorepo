export interface IMongoDBWatcherDataSource {
  watchCollection(callback: (event: any) => void): Promise<void>
  close(): void
}
