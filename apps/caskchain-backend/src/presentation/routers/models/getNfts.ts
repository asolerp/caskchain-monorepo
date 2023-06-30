import { MongoClient } from 'mongodb'
import { Web3Transaction } from '../../../data/data-sources/blockchain/Web3Transaction'
import { MongoDBNFTDataSource } from '../../../data/data-sources/mongodb/MongoDBNFTDataSource'
import { MongoDBUserDataSource } from '../../../data/data-sources/mongodb/MongoDBUserDataSource'
import { NFTRepositoryImpl } from '../../../domain/repositories/nft-repository'
import { UserRepositoryImpl } from '../../../domain/repositories/user-repository'
import { FavoriteNFT } from '../../../domain/use-cases/nft/favorite-nft'
import { FractionalizeNft } from '../../../domain/use-cases/nft/fractionalize-nft'
import { GetCaskInfo } from '../../../domain/use-cases/nft/get-cask-info'
import { GetNFTFavoritesCounter } from '../../../domain/use-cases/nft/get-nft-favorites-counter'
import { GetNFTs } from '../../../domain/use-cases/nft/get-nfts'
import { GetOwnedNFTs } from '../../../domain/use-cases/nft/get-owned-nfts'
import { NftFavoriteCounter } from '../../../domain/use-cases/nft/nft-favorite-counter'
import GetNftsRouter from '../get-nfts'
import { GetFavoriteNfts } from '../../../domain/use-cases/nft/get-favorite-nfts'
import { GetBestNfts } from '../../../domain/use-cases/nft/get-best-nfts'

export const getNfts = (
  clientDB: Promise<MongoClient>,
  web3Client: any,
  web3WsClient: any,
  web3Contracts: any
) => {
  const web3Transaction = new Web3Transaction(
    web3Client,
    web3WsClient,
    web3Contracts
  )
  const mongoDBNFTDataSource = new MongoDBNFTDataSource(clientDB)
  const nftRepositoryImpl = new NFTRepositoryImpl(
    web3Transaction,
    mongoDBNFTDataSource
  )

  const userRepositoryImpl = new UserRepositoryImpl(
    new MongoDBUserDataSource(clientDB)
  )

  return GetNftsRouter(
    new GetNFTs(nftRepositoryImpl),
    new GetCaskInfo(nftRepositoryImpl),
    new GetFavoriteNfts(nftRepositoryImpl),
    new FavoriteNFT(userRepositoryImpl),
    new GetNFTFavoritesCounter(nftRepositoryImpl),
    new GetBestNfts(nftRepositoryImpl),
    new NftFavoriteCounter(nftRepositoryImpl),
    new GetOwnedNFTs(nftRepositoryImpl),
    new FractionalizeNft(nftRepositoryImpl)
  )
}
