import { MongoDBNFTDataSource } from '../data/data-sources/mongodb/MongoDBNFTDataSource'
import { MongoDBOfferDataSource } from '../data/data-sources/mongodb/MongoDBOfferDataSource'
import { MongoDBRoyaltyDataSource } from '../data/data-sources/mongodb/MongoDBRoyaltiesDataSource'
import { MongoDBTransactionHistoryDataSource } from '../data/data-sources/mongodb/MongoDBTransactionHistoryDataSource'
import { AcceptOfferImpl } from '../domain/repositories/accept-offer-repository'
import { NFTRepositoryImpl } from '../domain/repositories/nft-repository'
import { RecordOfferImpl } from '../domain/repositories/record-offer-repository'
import { RemoveOfferImpl } from '../domain/repositories/remove-offer-repository'
import { RoyaltyImpl } from '../domain/repositories/royalty-repository'
import { TransactionRepositoryImpl } from '../domain/repositories/transaction-repository'
import { CreateNFT } from '../domain/use-cases/nft/create-nft'
import { NewFraction } from '../domain/use-cases/nft/new-fraction'
import { UpdateOwnerNft } from '../domain/use-cases/nft/update-owner-nft'
import { UpdatePriceNft } from '../domain/use-cases/nft/update-price-nft'
import { UpdateSaleStateNft } from '../domain/use-cases/nft/update-sale-state-nft'
import { AcceptOffer } from '../domain/use-cases/offer/accept-offer'
import { RecordOffer } from '../domain/use-cases/offer/record-offer'
import { RemoveOffer } from '../domain/use-cases/offer/remove-offer'
import { SaveRoyalty } from '../domain/use-cases/payments/save-royalty'
import { CreateTransaction } from '../domain/use-cases/transaction/create-transaction'
import OnAcceptOffer from '../presentation/subscriptions/on-accept-offer'
import OnListed from '../presentation/subscriptions/on-listed'
import OnMint from '../presentation/subscriptions/on-mint'
import OnNewFraction from '../presentation/subscriptions/on-new-fraction'
import OnOffer from '../presentation/subscriptions/on-offer'
import OnRemoveOffer from '../presentation/subscriptions/on-remove-offer'
import OnRoyalty from '../presentation/subscriptions/on-royalty'
import OnSaleStateChanged from '../presentation/subscriptions/on-sale-state-changed'
import OnTransfer from '../presentation/subscriptions/on-transfer'

export const setupEventHandlers = (
  eventsHandler: any,
  clientDB: any,
  web3Transaction: any
) => {
  const recordOfferImpl = new RecordOfferImpl(
    new MongoDBOfferDataSource(clientDB)
  )
  const acceptOfferImpl = new AcceptOfferImpl(
    new MongoDBOfferDataSource(clientDB)
  )
  const removeOfferImpl = new RemoveOfferImpl(
    new MongoDBOfferDataSource(clientDB)
  )

  const nftRepositoryImpl = new NFTRepositoryImpl(
    web3Transaction,
    new MongoDBNFTDataSource(clientDB)
  )

  const transactionRepositoryImpl = new TransactionRepositoryImpl(
    new MongoDBTransactionHistoryDataSource(clientDB)
  )

  new SaveRoyalty(new RoyaltyImpl(new MongoDBRoyaltyDataSource(clientDB)))

  const handleOnNewFraction = OnNewFraction(new NewFraction(nftRepositoryImpl))

  const handelOnMint = OnMint(new CreateNFT(nftRepositoryImpl))

  const handleOnListed = OnListed(new UpdatePriceNft(nftRepositoryImpl))

  const handleOnUpdatePrice = OnListed(new UpdatePriceNft(nftRepositoryImpl))

  const handleOnSaleStateChanged = OnSaleStateChanged(
    new UpdateSaleStateNft(nftRepositoryImpl)
  )

  const handleOnRoyalty = OnRoyalty(
    new SaveRoyalty(new RoyaltyImpl(new MongoDBRoyaltyDataSource(clientDB)))
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
  // eventsHandler.subscribeLogEvent(
  //   'NftVendor',
  //   'ItemPiceUpdated',
  //   handleOnUpdatePrice
  // )

  eventsHandler.subscribeLogEvent(
    'NftVendor',
    'NftStableCoinPriceUpdated',
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
}
