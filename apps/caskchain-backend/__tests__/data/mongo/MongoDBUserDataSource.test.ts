import { MongoDBUserDataSource } from '../../../src/data/data-sources/mongodb/MongoDBUserDataSource'
import { MongoDBNFTDataSource } from '../../../src/data/data-sources/mongodb/MongoDBNFTDataSource'
import { MongoClientFactory } from '../../../src/data/data-sources/mongodb/MongoClientFactory'

describe('MongoDBUserDataSource', () => {
  let mongoDBUserDataSource: MongoDBUserDataSource
  let mongoDBNFTDataSource: MongoDBNFTDataSource
  let testClient: any

  beforeAll(async () => {
    const userId = 'testUserId'
    const caskId = 'testCaskId'
    const address = '0x0000'
    // Set up a mock MongoClient instance
    testClient = MongoClientFactory.createClient('test', {
      url: 'mongodb://localhost:27017/test',
    })

    // Connect the mock MongoClient and pass it to the MongoDBUserDataSource constructor

    mongoDBUserDataSource = new MongoDBUserDataSource(
      Promise.resolve(testClient)
    )
    mongoDBNFTDataSource = new MongoDBNFTDataSource(Promise.resolve(testClient))

    const nft = {
      name: 'My NFT',
      description: 'This is my awesome NFT',
      image: 'https://example.com/my-nft.png',
      attributes: {
        attribute1: 'value1',
        attribute2: 'value2',
      },
      value: '1 ETH',
      pinata: 'QmX9q3L3oFePdSs7VgS1tRFq7VGRzvDtrj7ZN4QXg8sGxx',
      owner: {
        address: '0x1234567890123456789012345678901234567890',
        name: 'John Doe',
      },
      favorites: 0,
    }

    await mongoDBUserDataSource.save(userId, {
      address,
      favorites: [],
    })

    await mongoDBNFTDataSource.save(caskId, nft)
  })

  afterAll(async () => {
    // Clear the test database before each test
    // console.log('TESTING', (await testClient).db())
    return (await testClient).db().dropDatabase()
  })

  describe('addFavorite', () => {
    it('should add a favorite cask to a user', async () => {
      // Create a test user and a test cask ID
      const userId = 'testUserId'
      const caskId = 'testCaskId'
      const address = '0x0000'

      // Add the test cask to the test user's favorites list
      const updatedState = await mongoDBUserDataSource.addFavorite(
        userId,
        caskId
      )

      // Check that the updated state is 'added'
      expect(updatedState).toBe('added')

      // Retrieve the test user's document from the database
      const document = await mongoDBUserDataSource.search(address)

      // Check that the test cask was added to the user's favorites list
      expect(document?.favorites?.[caskId]).toBe(true)
    })

    it('should remove a favorite cask from a user', async () => {
      // Create a test user and a test cask ID
      const userId = 'testUserId'
      const caskId = 'testCaskId'
      const address = '0x0000'

      // Remove the test cask from the test user's favorites list
      const updatedState = await mongoDBUserDataSource.addFavorite(
        userId,
        caskId
      )

      // Check that the updated state is 'removed'
      expect(updatedState).toBe('removed')

      // Retrieve the test user's document from the database
      const document = await mongoDBUserDataSource.search(address)

      // Check that the test cask was removed from the user's favorites list
      expect(document?.favorites?.[caskId]).toBe(undefined)
    })
  })

  describe('save', () => {
    it('should save a user document to the database', async () => {
      // Create a test user document
      const id = 'testUserId2'
      const address = '0x00001'
      const user = { name: 'Test User', address, favorites: {} }

      // Save the test user document to the database
      await mongoDBUserDataSource.save(id, user)

      // Retrieve the test user document from the database
      const document = await mongoDBUserDataSource.search(address)

      // Check that the retrieved document matches the test user document
      expect(document).toEqual(expect.objectContaining(user))
    })
  })

  describe('search', () => {
    it('should search for a user document by address', async () => {
      // Create a test user document
      const id = 'testUserId3'
      const address = '0x00003'
      const user = { name: 'Test User', address, favorites: {} }

      // Save the test user document to the database
      await mongoDBUserDataSource.save(id, user)

      // Search for the test user document by address
      const document = await mongoDBUserDataSource.search(address)

      // Check that the retrieved document matches the test user document
      expect(document).toEqual(expect.objectContaining(user))
    })

    it('should return null if no user document matches the address', async () => {
      // Search for a non-existent user document by address
      const document = await mongoDBUserDataSource.search(
        'Non-Existent Address'
      )

      // Check that the retrieved document is null
      expect(document).toBeNull()
    })
  })
})
