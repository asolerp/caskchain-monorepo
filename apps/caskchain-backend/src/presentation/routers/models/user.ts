import { MongoClient } from 'mongodb'
import { Web3Transaction } from '../../../data/data-sources/blockchain/Web3Transaction'
import { MongoDBNFTDataSource } from '../../../data/data-sources/mongodb/MongoDBNFTDataSource'
import { MongoDBRefreshTokensDataSource } from '../../../data/data-sources/mongodb/MongoDBRefreshTokensDataSource'
import { MongoDBUserDataSource } from '../../../data/data-sources/mongodb/MongoDBUserDataSource'
import { NFTRepositoryImpl } from '../../../domain/repositories/nft-repository'
import { RefreshTokensRepositoryImpl } from '../../../domain/repositories/refresh-tokens-repository'
import { UserRepositoryImpl } from '../../../domain/repositories/user-repository'
import { AddRefreshTokens } from '../../../domain/use-cases/user/add-refresh-token'
import { CreateUser } from '../../../domain/use-cases/user/create-user'
import { DeleteTokens } from '../../../domain/use-cases/user/delete-tokens'
import { GetBalances } from '../../../domain/use-cases/user/get-balances'
import { GetRefreshTokens } from '../../../domain/use-cases/user/get-refresh-tokens'
import { GetUser } from '../../../domain/use-cases/user/get-user'
import UserRouter from '../user-router'

export const user = (
  clientDB: Promise<MongoClient>,
  web3Client: any,
  web3WsClient: any,
  web3Contracts: any
) =>
  UserRouter(
    new GetUser(new UserRepositoryImpl(new MongoDBUserDataSource(clientDB))),
    new GetBalances(
      new NFTRepositoryImpl(
        new Web3Transaction(web3Client, web3WsClient, web3Contracts),
        new MongoDBNFTDataSource(clientDB)
      )
    ),
    new CreateUser(new UserRepositoryImpl(new MongoDBUserDataSource(clientDB))),
    new GetRefreshTokens(
      new RefreshTokensRepositoryImpl(
        new MongoDBRefreshTokensDataSource(clientDB)
      )
    ),
    new AddRefreshTokens(
      new RefreshTokensRepositoryImpl(
        new MongoDBRefreshTokensDataSource(clientDB)
      )
    ),
    new DeleteTokens(
      new RefreshTokensRepositoryImpl(
        new MongoDBRefreshTokensDataSource(clientDB)
      )
    )
  )
