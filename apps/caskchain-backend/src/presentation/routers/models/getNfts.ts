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

export const getNfts = (
  clientDB: Promise<MongoClient>,
  web3Client: any,
  web3WsClient: any,
  web3Contracts: any
) =>
  GetNftsRouter(
    new GetNFTs(
      new NFTRepositoryImpl(
        new Web3Transaction(web3Client, web3WsClient, web3Contracts),
        new MongoDBNFTDataSource(clientDB)
      )
    ),
    new GetCaskInfo(
      new NFTRepositoryImpl(
        new Web3Transaction(web3Client, web3WsClient, web3Contracts),
        new MongoDBNFTDataSource(clientDB)
      )
    ),
    new GetFavoriteNfts(
      new NFTRepositoryImpl(
        new Web3Transaction(web3Client, web3WsClient, web3Contracts),
        new MongoDBNFTDataSource(clientDB)
      )
    ),
    new FavoriteNFT(
      new UserRepositoryImpl(new MongoDBUserDataSource(clientDB))
    ),
    new GetNFTFavoritesCounter(
      new NFTRepositoryImpl(
        new Web3Transaction(web3Client, web3WsClient, web3Contracts),
        new MongoDBNFTDataSource(clientDB)
      )
    ),
    new NftFavoriteCounter(
      new NFTRepositoryImpl(
        new Web3Transaction(web3Client, web3WsClient, web3Contracts),
        new MongoDBNFTDataSource(clientDB)
      )
    ),
    new GetOwnedNFTs(
      new NFTRepositoryImpl(
        new Web3Transaction(web3Client, web3WsClient, web3Contracts),
        new MongoDBNFTDataSource(clientDB)
      )
    ),
    new FractionalizeNft(
      new NFTRepositoryImpl(
        new Web3Transaction(web3Client, web3WsClient, web3Contracts),
        new MongoDBNFTDataSource(clientDB)
      )
    )
  )
