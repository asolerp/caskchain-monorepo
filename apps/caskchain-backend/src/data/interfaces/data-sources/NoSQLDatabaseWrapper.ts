import { Sort } from 'mongodb'

export interface NoSQLDatabaseWrapper {
  find(query: object, sort?: Sort): Promise<any[]>
  insertOne(doc: any): void
  deleteOne(id: string): void
  updateOne(id: string, data: object): void
}
