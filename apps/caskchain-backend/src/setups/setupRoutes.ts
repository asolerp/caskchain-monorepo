import { MongoDBNFTDataSource } from '../data/data-sources/mongodb/MongoDBNFTDataSource'
import { MongoDBOfferDataSource } from '../data/data-sources/mongodb/MongoDBOfferDataSource'
import { MongoDBRecordPaymentsDataSource } from '../data/data-sources/mongodb/MongoDBRecordPaymentsDataSource'
import { MongoDBRoyaltyDataSource } from '../data/data-sources/mongodb/MongoDBRoyaltiesDataSource'
import { MongoDBStatsDataSource } from '../data/data-sources/mongodb/MongoDBStatsDataSource'
import { MongoDBTransactionHistoryDataSource } from '../data/data-sources/mongodb/MongoDBTransactionHistoryDataSource'
import { NFTRepositoryImpl } from '../domain/repositories/nft-repository'
import { OfferImpl } from '../domain/repositories/offer-repository'
import { PaymentsRepositoryImpl } from '../domain/repositories/payments-repository'
import { RecordPaymentsImpl } from '../domain/repositories/record-payments-repository'
import { RoyaltyImpl } from '../domain/repositories/royalty-repository'
import { StatsImpl } from '../domain/repositories/stats-repository'
import { TransactionRepositoryImpl } from '../domain/repositories/transaction-repository'
import { SendBougthNFT } from '../domain/use-cases/nft/send-bought-nft'
import { GetOffers } from '../domain/use-cases/offer/get-offers'
import { GetReceivedOffers } from '../domain/use-cases/offer/get-received-offers'
import { GetSentOffers } from '../domain/use-cases/offer/get-sent-offers'
import { CreateCheckoutSession } from '../domain/use-cases/payments/create-checkout-session'
import { GetPaymentByPaymentId } from '../domain/use-cases/payments/get-payment-by-payment-id'
import { RecordInitPayment } from '../domain/use-cases/payments/record-init-payment'
import { UpdatePaymentStatus } from '../domain/use-cases/payments/update-payment-status'
import { GetNftSalesHistory } from '../domain/use-cases/sales/get-nft-sales-history'
import { GetFilters } from '../domain/use-cases/stats/get-filters'
import { GetTotalNfts } from '../domain/use-cases/stats/get-total-nfts'
import { GetTotalUsers } from '../domain/use-cases/stats/get-total-users'
import { GetRoyalties } from '../domain/use-cases/transaction/get-royalties'
import { GetTransactionByTokenId } from '../domain/use-cases/transaction/get-transaction-by-token-id-use-case'
import { GetTransactionByWalletAddress } from '../domain/use-cases/transaction/get-transaction-by-wallet-address-use-case'
import { GetTransactions } from '../domain/use-cases/transaction/get-transactions-use-case'
import CreateCheckoutSessionRouter from '../presentation/routers/create-checkout-session'
import { getNfts } from '../presentation/routers/models/getNfts'
import { user } from '../presentation/routers/models/user'
import OffersRouter from '../presentation/routers/offers-router'
import OrderBottleRouter from '../presentation/routers/order-bottle'
import PinNftRouter from '../presentation/routers/pin-nft-router'
import SignatureRouter from '../presentation/routers/signature'
import StatsRouter from '../presentation/routers/stats-router'
import TransactionsHistoryRouter from '../presentation/routers/transactions-history-router'
import WebhookRouter from '../presentation/routers/webhook'

export const setupRoutes = (
  server: any,
  clientDB: any,
  web3Client: any,
  web3WsClient: any,
  web3Contracts: any,
  payments: any,
  web3Transaction: any
) => {
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
  // const ratesImpl = new CryptoRateRepositoryImpl(
  //   new MongoDBCryptoRatesDataSource(clientDB)
  // )

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

  // const rates = RateRouter(new GetCryptoRates(ratesImpl))

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

  const routes = [
    {
      path: '/api/user',
      handler: user(clientDB, web3Client, web3WsClient, web3Contracts),
    },
    { path: '/api/stats', handler: stats },
    // { path: '/api/rates', handler: rates },
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
}
