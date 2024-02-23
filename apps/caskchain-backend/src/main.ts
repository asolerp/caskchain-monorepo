import { Web3ClientFactory } from './data/data-sources/blockchain/Web3ClientFactory'
import { Web3Transaction } from './data/data-sources/blockchain/Web3Transaction'
import { MongoClientFactory } from './data/data-sources/mongodb/MongoClientFactory'

import server from './server'
import { Web3Events } from './data/data-sources/blockchain/Web3Events'
import { MongoDBUsersWatcher } from './data/data-sources/mongodb/MongoDBUsersWatcher'
import { contracts, getContractData } from './domain/contracts'
import { stripeConnection } from './data/payments/StripeConnection'
// import { FetchCryptoRate } from './domain/use-cases/rates/fetch-crypto-rate'

// import { CryptoRateRepositoryImpl } from './domain/repositories/crypto-rate-repository'

// import { CryptoRatesServiceImpl } from './domain/services/crypto-rate-service'
// import RateRouter from './presentation/routers/rates-router'
// import { GetCryptoRates } from './domain/use-cases/rates/get-crypto-rates'
// import { CronService } from './data/scheduling/CronService'
// import { MongoDBCryptoRatesDataSource } from './data/data-sources/mongodb/MongoDBCryptoRatesDataSource'
import { setupRoutes } from './setups/setupRoutes'
import { setupEventHandlers } from './setups/setupEventHandlers'
import { setupUserWatchers } from './setups/setupUserWatchers'
;(async () => {
  const clientDB = MongoClientFactory.createClient(
    process.env.CONTEXT_NAME as string,
    {
      url: process.env.MONGO_DB_URL,
    }
  )

  const { client: web3Client, wsClient: web3WsClient } =
    Web3ClientFactory.createClient(
      process.env.MNEMONIC as string,
      process.env.CONTEXT_NAME as string,
      process.env.BLOCKCHAIN_URL as string,
      process.env.BLOCKCHAIN_WS_URL as string,
      contracts.map(({ contract, name }) => getContractData(contract, name))
    )

  const web3Contracts = Web3ClientFactory.getContracts()
  const eventsHandler = new Web3Events(web3Client, web3WsClient, web3Contracts)
  const payments = stripeConnection()

  const web3Transaction = new Web3Transaction(
    web3Client,
    web3WsClient,
    web3Contracts
  )

  const usersWatcher = new MongoDBUsersWatcher(clientDB)

  setupRoutes(
    server,
    clientDB,
    web3Client,
    web3WsClient,
    web3Contracts,
    payments,
    web3Transaction
  )

  setupEventHandlers(eventsHandler, clientDB, web3Transaction)
  setupUserWatchers(usersWatcher, clientDB)

  server.listen(process.env.PORT || 4000, () =>
    console.log(`Running on ${process.env.PORT}`)
  )
})()
