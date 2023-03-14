import { Collection, MongoClient } from 'mongodb';


export abstract class MongoRepository {
  constructor(private _client: Promise<MongoClient>) {}

  protected abstract collectionName(): string;

  protected client(): Promise<MongoClient> {
    return this._client;
  }

  protected async collection(): Promise<Collection> {
    return (await this._client).db().collection(this.collectionName());
  }

  protected async persist(id: string, aggregateRoot: any): Promise<void> {
    const collection = await this.collection();
    const document = { ...aggregateRoot, _id: id, id: undefined };
    await collection.updateOne({ _id: id }, { $set: document }, { upsert: true });
  }
}
