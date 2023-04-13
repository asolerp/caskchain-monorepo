import { MongoDBTransactionHistoryDataSource } from '../../../src/data/data-sources/mongodb/MongoDBTransactionHistoryDataSource'
import { TransactionHistoryRequestModel } from '../../../src/domain/model/TransactionHistory'
import { MongoClientFactory } from '../../../src/data/data-sources/mongodb/MongoClientFactory'

describe('MongoDBTransactionHistoryDataSource', () => {
  let dataSource: MongoDBTransactionHistoryDataSource
  let testClient: any

  beforeAll(async () => {
    // Set up a mock MongoClient instance
    testClient = MongoClientFactory.createClient('test', {
      url: 'mongodb://localhost:27017/test',
    })

    // Connect the mock MongoClient and pass it to the MongoDBUserDataSource constructor

    dataSource = new MongoDBTransactionHistoryDataSource(
      Promise.resolve(testClient)
    )
    dataSource = new MongoDBTransactionHistoryDataSource(
      Promise.resolve(testClient)
    )
  })

  afterAll(async () => {
    // Clear the test database before each test
    // console.log('TESTING', (await testClient).db())
    return (await testClient).db().dropDatabase()
  })

  it('should save a transaction to the database', async () => {
    const id = '123'
    const transaction: TransactionHistoryRequestModel = {
      tokenId: '456',
      date: '2021-08-01T00:00:00.000Z' as any,
      from: 'address1',
      to: 'address2',
      type: 'transfer',
      value: '10',
    }

    await dataSource.save(id, transaction)

    const document = await dataSource.search('456')

    expect(document).toEqual([
      {
        _id: id,
        tokenId: '456',
        from: 'address1',
        to: 'address2',
        type: 'transfer',
        date: '2021-08-01T00:00:00.000Z' as any,
        value: '10',
      },
    ])
  })

  it('should search for a transaction by tokenId', async () => {
    const transaction: TransactionHistoryRequestModel = {
      tokenId: '456',
      from: 'address1',
      to: 'address2',
      type: 'transfer',
      date: '2021-08-01T00:00:00.000Z' as any,
      value: '10',
    }
    await dataSource.save('123', transaction)

    const result = await dataSource.search('456')

    expect(result).toEqual([
      {
        _id: '123',
        tokenId: '456',
        from: 'address1',
        to: 'address2',
        type: 'transfer',
        date: '2021-08-01T00:00:00.000Z' as any,
        value: '10',
      },
    ])
  })

  it('should search for transactions by wallet address', async () => {
    const transaction1: TransactionHistoryRequestModel = {
      tokenId: '456',
      date: '2021-08-01T00:00:00.000Z' as any,
      from: 'address1',
      to: 'address2',
      type: 'transfer',
      value: '10',
    }
    const transaction2: TransactionHistoryRequestModel = {
      tokenId: '789',
      date: '2021-08-01T00:00:00.000Z' as any,
      from: 'address2',
      to: 'address3',
      type: 'transfer',
      value: '20',
    }
    await dataSource.save('123', transaction1)
    await dataSource.save('456', transaction2)

    const result = await dataSource.searchByWalletAddress('address2')

    expect(result).toEqual([
      {
        _id: '123',
        tokenId: '456',
        from: 'address1',
        to: 'address2',
        date: '2021-08-01T00:00:00.000Z' as any,
        type: 'transfer',
        value: '10',
      },
      {
        _id: '456',
        tokenId: '789',
        date: '2021-08-01T00:00:00.000Z' as any,
        from: 'address2',
        to: 'address3',
        type: 'transfer',
        value: '20',
      },
    ])
  })
})
