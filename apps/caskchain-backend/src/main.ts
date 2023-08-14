import { Web3ClientFactory } from './data/data-sources/blockchain/Web3ClientFactory'
import { Web3Transaction } from './data/data-sources/blockchain/Web3Transaction'
import { MongoClientFactory } from './data/data-sources/mongodb/MongoClientFactory'

import { MongoDBRecordPaymentsDataSource } from './data/data-sources/mongodb/MongoDBRecordPaymentsDataSource'
import { MongoDBTransactionHistoryDataSource } from './data/data-sources/mongodb/MongoDBTransactionHistoryDataSource'

import { RecordPaymentsImpl } from './domain/repositories/record-payments-repository'
import { NFTRepositoryImpl } from './domain/repositories/nft-repository'
import { TransactionRepositoryImpl } from './domain/repositories/transaction-repository'
import { SendBougthNFT } from './domain/use-cases/nft/send-bought-nft'
import { CreateCheckoutSession } from './domain/use-cases/payments/create-checkout-session'
import { GetPaymentByPaymentId } from './domain/use-cases/payments/get-payment-by-payment-id'
import { RecordInitPayment } from './domain/use-cases/payments/record-init-payment'
import { CreateTransaction } from './domain/use-cases/transaction/create-transaction'
import { GetTransactionByTokenId } from './domain/use-cases/transaction/get-transaction-by-token-id-use-case'
import CreateCheckoutSessionRouter from './presentation/routers/create-checkout-session'
import OrderBottleRouter from './presentation/routers/order-bottle'
import TransactionsHistoryRouter from './presentation/routers/transactions-history-router'

import WebhookRouter from './presentation/routers/webhook'
import server from './server'

import { Web3Events } from './data/data-sources/blockchain/Web3Events'
import OnTransfer from './presentation/subscriptions/on-transfer'
import SignatureRouter from './presentation/routers/signature'
import { MongoDBNFTDataSource } from './data/data-sources/mongodb/MongoDBNFTDataSource'
import { UpdatePaymentStatus } from './domain/use-cases/payments/update-payment-status'
import OnOffer from './presentation/subscriptions/on-offer'
import { RecordOffer } from './domain/use-cases/offer/record-offer'
import { OfferImpl } from './domain/repositories/offer-repository'
import { MongoDBOfferDataSource } from './data/data-sources/mongodb/MongoDBOfferDataSource'
import OffersRouter from './presentation/routers/offers-router'

import { RecordOfferImpl } from './domain/repositories/record-offer-repository'

import OnMint from './presentation/subscriptions/on-mint'
import { CreateNFT } from './domain/use-cases/nft/create-nft'
import { user } from './presentation/routers/models/user'
import { getNfts } from './presentation/routers/models/getNfts'
import { GetTransactionByWalletAddress } from './domain/use-cases/transaction/get-transaction-by-wallet-address-use-case'
import { GetReceivedOffers } from './domain/use-cases/offer/get-received-offers'
import { GetSentOffers } from './domain/use-cases/offer/get-sent-offers'
import OnRemoveOffer from './presentation/subscriptions/on-remove-offer'
import { RemoveOffer } from './domain/use-cases/offer/remove-offer'
import { RemoveOfferImpl } from './domain/repositories/remove-offer-repository'
import OnAcceptOffer from './presentation/subscriptions/on-accept-offer'
import { AcceptOffer } from './domain/use-cases/offer/accept-offer'
import { AcceptOfferImpl } from './domain/repositories/accept-offer-repository'
import { UpdateOwnerNft } from './domain/use-cases/nft/update-owner-nft'
import { GetNftSalesHistory } from './domain/use-cases/sales/get-nft-sales-history'
import { GetOffers } from './domain/use-cases/offer/get-offers'
import StatsRouter from './presentation/routers/stats-router'
import { GetTotalUsers } from './domain/use-cases/stats/get-total-users'
import { GetFilters } from './domain/use-cases/stats/get-filters'
import { StatsImpl } from './domain/repositories/stats-repository'
import { MongoDBStatsDataSource } from './data/data-sources/mongodb/MongoDBStatsDataSource'
import { GetTotalNfts } from './domain/use-cases/stats/get-total-nfts'
import { GetTransactions } from './domain/use-cases/transaction/get-transactions-use-case'
import { MongoDBUsersWatcher } from './data/data-sources/mongodb/MongoDBUsersWatcher'
import UserDBWatcher from './presentation/watchers/user-db-watcher'
import { IncrementTotalUsers } from './domain/use-cases/stats/increment-total-users'
import OnRoyalty from './presentation/subscriptions/on-royalty'
import { SaveRoyalty } from './domain/use-cases/payments/save-royalty'
import { RoyaltyImpl } from './domain/repositories/royalty-repository'
import { MongoDBRoyaltyDataSource } from './data/data-sources/mongodb/MongoDBRoyaltiesDataSource'
import { GetRoyalties } from './domain/use-cases/transaction/get-royalties'
import PinNftRouter from './presentation/routers/pin-nft-router'
import OnListed from './presentation/subscriptions/on-listed'
import { UpdatePriceNft } from './domain/use-cases/nft/update-price-nft'
import OnSaleStateChanged from './presentation/subscriptions/on-sale-state-changed'
import { UpdateSaleStateNft } from './domain/use-cases/nft/update-sale-state-nft'
import { contracts, getContractData } from './domain/contracts'
import { stripeConnection } from './data/payments/StripeConnection'
import { FetchCryptoRate } from './domain/use-cases/rates/fetch-crypto-rate'
import { PaymentsRepositoryImpl } from './domain/repositories/payments-repository'
import OnNewFraction from './presentation/subscriptions/on-new-fraction'
import { NewFraction } from './domain/use-cases/nft/new-fraction'

import CronService from './data/scheduling/CronService'
import { CryptoRateRepositoryImpl } from './domain/repositories/crypto-rate-repository'
import { MongoDBCryptoRatesDataSource } from './data/data-sources/mongodb/MongoDBCryptoRatesDataSource'
import { CryptoRatesServiceImpl } from './domain/services/crypto-rate-service'
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

  // ROUTES

  const web3Transaction = new Web3Transaction(
    web3Client,
    web3WsClient,
    web3Contracts
  )
  const nftRepositoryImpl = new NFTRepositoryImpl(
    web3Transaction,
    new MongoDBNFTDataSource(clientDB)
  )
  const transactionRepositoryImpl = new TransactionRepositoryImpl(
    new MongoDBTransactionHistoryDataSource(clientDB)
  )

  const paymentsRepositoryImpl = new PaymentsRepositoryImpl(payments)

  const recordPaymentsImpl = new RecordPaymentsImpl(
    new MongoDBRecordPaymentsDataSource(clientDB)
  )
  const offerImpl = new OfferImpl(new MongoDBOfferDataSource(clientDB))
  const statsImpl = new StatsImpl(new MongoDBStatsDataSource(clientDB))

  const recordOfferImpl = new RecordOfferImpl(
    new MongoDBOfferDataSource(clientDB)
  )
  const acceptOfferImpl = new AcceptOfferImpl(
    new MongoDBOfferDataSource(clientDB)
  )
  const removeOfferImpl = new RemoveOfferImpl(
    new MongoDBOfferDataSource(clientDB)
  )

  const pinNftMiddleWare = PinNftRouter()
  const signature = SignatureRouter()
  const orderBottleMiddleWare = OrderBottleRouter()
  const transactionsHistory = TransactionsHistoryRouter(
    new GetNftSalesHistory(transactionRepositoryImpl),
    new GetRoyalties(new RoyaltyImpl(new MongoDBRoyaltyDataSource(clientDB))),
    new GetTransactions(transactionRepositoryImpl),
    new GetTransactionByTokenId(transactionRepositoryImpl),
    new GetTransactionByWalletAddress(transactionRepositoryImpl)
  )

  const createCheckoutSession = CreateCheckoutSessionRouter(
    new CreateCheckoutSession(paymentsRepositoryImpl),
    new RecordInitPayment(recordPaymentsImpl)
  )

  const stats = StatsRouter(
    new GetTotalUsers(statsImpl),
    new GetTotalNfts(nftRepositoryImpl),
    new GetFilters(statsImpl)
  )

  const offers = OffersRouter(
    new GetSentOffers(offerImpl),
    new GetReceivedOffers(offerImpl),
    new GetOffers(offerImpl)
  )

  const webhook = WebhookRouter(
    new GetPaymentByPaymentId(recordPaymentsImpl),
    new SendBougthNFT(nftRepositoryImpl),
    new UpdatePaymentStatus(recordPaymentsImpl)
  )

  // EVENTS

  const handleOnRoyalty = OnRoyalty(
    new SaveRoyalty(new RoyaltyImpl(new MongoDBRoyaltyDataSource(clientDB)))
  )

  const handleOnNewFraction = OnNewFraction(new NewFraction(nftRepositoryImpl))

  const handelOnMint = OnMint(new CreateNFT(nftRepositoryImpl))

  const handleOnListed = OnListed(new UpdatePriceNft(nftRepositoryImpl))

  const handleOnUpdatePrice = OnListed(new UpdatePriceNft(nftRepositoryImpl))

  const handleOnSaleStateChanged = OnSaleStateChanged(
    new UpdateSaleStateNft(nftRepositoryImpl)
  )

  const handleOnTransfer = OnTransfer(
    new UpdateOwnerNft(nftRepositoryImpl),
    new CreateTransaction(transactionRepositoryImpl)
  )

  const handleOnNewOffer = OnOffer(new RecordOffer(recordOfferImpl))

  const handleAcceptOffer = OnAcceptOffer(
    new AcceptOffer(acceptOfferImpl),
    new CreateTransaction(transactionRepositoryImpl)
  )

  const handleRemoveOffer = OnRemoveOffer(new RemoveOffer(removeOfferImpl))

  eventsHandler.subscribeLogEvent('CCNft', 'Mint', handelOnMint)
  eventsHandler.subscribeLogEvent('CCNft', 'Approval')
  eventsHandler.subscribeLogEvent('CCNft', 'Transfer', (transaction: any) =>
    handleOnTransfer(transaction, 'transfer')
  )

  eventsHandler.subscribeLogEvent('NftVendor', 'ItemListed', handleOnListed)
  eventsHandler.subscribeLogEvent(
    'NftVendor',
    'ItemPiceUpdated',
    handleOnUpdatePrice
  )
  eventsHandler.subscribeLogEvent(
    'NftVendor',
    'ItemSaleStateUpdated',
    handleOnSaleStateChanged
  )

  eventsHandler.subscribeLogEvent(
    'NftVendor',
    'ItemBought',
    (transaction: any) => handleOnTransfer(transaction, 'item-bought')
  )
  eventsHandler.subscribeLogEvent('NftOffers', 'NewOffer', handleOnNewOffer)
  eventsHandler.subscribeLogEvent('NftOffers', 'RemoveOffer', handleRemoveOffer)
  eventsHandler.subscribeLogEvent('NftOffers', 'AcceptOffer', handleAcceptOffer)
  eventsHandler.subscribeLogEvent('NftVendor', 'TxFeePaid', handleOnRoyalty)
  eventsHandler.subscribeLogEvent(
    'NftFractionsFactory',
    'Mint',
    handleOnNewFraction
  )
  eventsHandler.subscribeLogEvent(
    'NftFractionToken',
    'StatusUpdate',
    handleOnSaleStateChanged
  )

  // WATCHERS
  const usersWatcher = new MongoDBUsersWatcher(clientDB)

  const { incrementTotalUsers } = UserDBWatcher(
    new IncrementTotalUsers(new StatsImpl(new MongoDBStatsDataSource(clientDB)))
  )

  usersWatcher.watchCollection(async (event) => {
    if (event.operationType === 'update') {
      if (event.updateDescription.updatedFields?.email !== undefined) {
        await incrementTotalUsers()
      }
    }
  })

  // CRON JOBS

  const fetchRateUseCase = new FetchCryptoRate(
    new CryptoRateRepositoryImpl(new MongoDBCryptoRatesDataSource(clientDB)),
    new CryptoRatesServiceImpl()
  )

  const cronService = new CronService(fetchRateUseCase)

  const routes = [
    {
      path: '/api/user',
      handler: user(clientDB, web3Client, web3WsClient, web3Contracts),
    },
    { path: '/api/stats', handler: stats },
    { path: '/api/signature', handler: signature },
    { path: '/api/pin-nft', handler: pinNftMiddleWare },
    { path: '/api/order-bottle', handler: orderBottleMiddleWare },
    { path: '/api/transactions', handler: transactionsHistory },
    { path: '/api/create-checkout-session', handler: createCheckoutSession },
    {
      path: '/api/casks',
      handler: getNfts(clientDB, web3Client, web3WsClient, web3Contracts),
    },
    { path: '/api/webhook', handler: webhook },
    { path: '/api/offers', handler: offers },
  ]

  routes.forEach((route) => server.use(route.path, route.handler))

  cronService.initCronJobs()

  server.listen(process.env.PORT || 4000, () =>
    console.log(`Running on ${process.env.PORT}`)
  )
})()
