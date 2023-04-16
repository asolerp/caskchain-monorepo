import { Web3ClientFactory } from './data/data-sources/blockchain/Web3ClientFactory'
import { Web3Transaction } from './data/data-sources/blockchain/Web3Transaction'
import { MongoClientFactory } from './data/data-sources/mongodb/MongoClientFactory'

import { MongoDBRecordPaymentsDataSource } from './data/data-sources/mongodb/MongoDBRecordPaymentsDataSource'
import { MongoDBTransactionHistoryDataSource } from './data/data-sources/mongodb/MongoDBTransactionHistoryDataSource'
import { stripeConnection } from './data/payments/StripeConnection'

import { PaymentsRepositoryImpl } from './domain/repositories/payments-repository'
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
import VerifyImageRouter from './presentation/routers/verify-image-router'
import VerifyRouter from './presentation/routers/verify-router'
import WebhookRouter from './presentation/routers/webhook'
import server from './server'
import CCNft from 'contracts/build/contracts/CCNft.json'
import NftVendor from 'contracts/build/contracts/NftVendor.json'
import NftOffers from 'contracts/build/contracts/NftOffers.json'
import NftFractionsFactory from 'contracts/build/contracts/NftFractionsFactory.json'
import NftFractionsVendor from 'contracts/build/contracts/NftFractionsVendor.json'
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
import { GetNFTLatestOffers } from './domain/use-cases/offer/get-nft-latest-offers'
import { GetNftSalesHistory } from './domain/use-cases/sales/get-nft-sales-history'
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
      [
        {
          contractName: 'CCNft',
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore: Unreachable code error
          contractAddress: CCNft.networks?.[process.env.NETWORK_ID as string]
            .address as string,
          contractABI: CCNft.abi,
        },
        {
          contractName: 'NftVendor',
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore: Unreachable code error
          contractAddress: NftVendor.networks?.[
            process.env.NETWORK_ID as string
          ].address as string,
          contractABI: NftVendor.abi,
        },
        {
          contractName: 'NftOffers',
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore: Unreachable code error
          contractAddress: NftOffers.networks?.[
            process.env.NETWORK_ID as string
          ].address as string,
          contractABI: NftOffers.abi,
        },
        {
          contractName: 'NftFractionsFactory',
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore: Unreachable code error
          contractAddress: NftFractionsFactory.networks?.[
            process.env.NETWORK_ID as string
          ].address as string,
          contractABI: NftFractionsFactory.abi,
        },
        {
          contractName: 'NftFractionsVendor',
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore: Unreachable code error
          contractAddress: NftFractionsVendor.networks?.[
            process.env.NETWORK_ID as string
          ].address as string,
          contractABI: NftFractionsVendor.abi,
        },
      ]
    )

  const web3Contracts = Web3ClientFactory.getContracts()

  const eventsHandler = new Web3Events(web3Client, web3WsClient, web3Contracts)

  const payments = stripeConnection()

  const verifyMiddleWare = VerifyRouter()
  const verifyImageMiddleWare = VerifyImageRouter()
  const signature = SignatureRouter()
  const orderBottleMiddleWare = OrderBottleRouter()
  const transactionsHistory = TransactionsHistoryRouter(
    new GetNftSalesHistory(
      new NFTRepositoryImpl(
        new Web3Transaction(web3Client, web3WsClient, web3Contracts),
        new MongoDBNFTDataSource(clientDB)
      )
    ),
    new GetTransactionByTokenId(
      new NFTRepositoryImpl(
        new Web3Transaction(web3Client, web3WsClient, web3Contracts),
        new MongoDBNFTDataSource(clientDB)
      )
    ),
    new GetTransactionByWalletAddress(
      new TransactionRepositoryImpl(
        new MongoDBTransactionHistoryDataSource(clientDB)
      )
    )
  )
  const createCheckoutSession = CreateCheckoutSessionRouter(
    new CreateCheckoutSession(new PaymentsRepositoryImpl(payments)),
    new RecordInitPayment(
      new RecordPaymentsImpl(new MongoDBRecordPaymentsDataSource(clientDB))
    )
  )

  const offers = OffersRouter(
    new GetSentOffers(new OfferImpl(new MongoDBOfferDataSource(clientDB))),
    new GetReceivedOffers(new OfferImpl(new MongoDBOfferDataSource(clientDB))),
    new GetNFTLatestOffers(
      new NFTRepositoryImpl(
        new Web3Transaction(web3Client, web3WsClient, web3Contracts),
        new MongoDBNFTDataSource(clientDB)
      )
    )
  )

  const webhook = WebhookRouter(
    new GetPaymentByPaymentId(
      new RecordPaymentsImpl(new MongoDBRecordPaymentsDataSource(clientDB))
    ),
    new SendBougthNFT(
      new NFTRepositoryImpl(
        new Web3Transaction(web3Client, web3WsClient, web3Contracts),
        new MongoDBNFTDataSource(clientDB)
      )
    ),
    new UpdatePaymentStatus(
      new RecordPaymentsImpl(new MongoDBRecordPaymentsDataSource(clientDB))
    )
  )

  const handelOnMint = OnMint(
    new CreateNFT(
      new NFTRepositoryImpl(
        new Web3Transaction(web3Client, web3WsClient, web3Contracts),
        new MongoDBNFTDataSource(clientDB)
      )
    )
  )

  const handleOnTransfer = OnTransfer(
    new UpdateOwnerNft(
      new NFTRepositoryImpl(
        new Web3Transaction(web3Client, web3WsClient, web3Contracts),
        new MongoDBNFTDataSource(clientDB)
      )
    ),
    new CreateTransaction(
      new TransactionRepositoryImpl(
        new MongoDBTransactionHistoryDataSource(clientDB)
      )
    )
  )

  const handleOnNewOffer = OnOffer(
    new RecordOffer(new RecordOfferImpl(new MongoDBOfferDataSource(clientDB)))
  )

  const handleAcceptOffer = OnAcceptOffer(
    new AcceptOffer(new AcceptOfferImpl(new MongoDBOfferDataSource(clientDB))),
    new CreateTransaction(
      new TransactionRepositoryImpl(
        new MongoDBTransactionHistoryDataSource(clientDB)
      )
    )
  )

  const handleRemoveOffer = OnRemoveOffer(
    new RemoveOffer(new RemoveOfferImpl(new MongoDBOfferDataSource(clientDB)))
  )

  eventsHandler.subscribeLogEvent('CCNft', 'Mint', handelOnMint)
  eventsHandler.subscribeLogEvent('CCNft', 'Approval')
  eventsHandler.subscribeLogEvent('CCNft', 'Transfer', (transaction: any) =>
    handleOnTransfer(transaction, 'transfer')
  )

  eventsHandler.subscribeLogEvent(
    'NftVendor',
    'ItemBought',
    (transaction: any) => handleOnTransfer(transaction, 'item-bought')
  )
  eventsHandler.subscribeLogEvent('NftOffers', 'NewOffer', handleOnNewOffer)
  eventsHandler.subscribeLogEvent('NftOffers', 'RemoveOffer', handleRemoveOffer)
  eventsHandler.subscribeLogEvent('NftOffers', 'AcceptOffer', handleAcceptOffer)

  server.use(
    '/api/user',
    user(clientDB, web3Client, web3WsClient, web3Contracts)
  )

  server.use('/api/signature', signature)
  server.use('/api/verify', verifyMiddleWare)
  server.use('/api/verify-image', verifyImageMiddleWare)
  server.use('/api/order-bottle', orderBottleMiddleWare)
  server.use('/api/transactions', transactionsHistory)
  server.use('/api/create-checkout-session', createCheckoutSession)
  server.use(
    '/api/casks',
    getNfts(clientDB, web3Client, web3WsClient, web3Contracts)
  )
  server.use('/api/webhook', webhook)
  server.use('/api/offers', offers)

  server.listen(process.env.PORT || 4000, () =>
    console.log(`Running on ${process.env.PORT}`)
  )
})()
