import { UserRequestModel } from '../../../domain/model/User'

import { UsersDataSource } from '../../interfaces/data-sources/UsersDataSource'

import { MongoRepository } from './MongoRepository'

export class MongoDBUserDataSource
  extends MongoRepository
  implements UsersDataSource
{
  protected collectionName(): string {
    return 'users'
  }

  public async addFavorite(
    userId: string,
    caskId: string
  ): Promise<any | null> {
    const collection = await this.collection()
    const document = await collection.findOne<any>({ _id: userId })
    const favorites = document?.favorites && Object.keys(document?.favorites)
    let updatedFavorites
    let updatedState

    if (favorites?.includes(caskId)) {
      updatedFavorites = Object.fromEntries(
        Object.entries(document?.favorites).filter(([key]) => key !== caskId)
      )
      updatedState = 'removed'
    } else {
      updatedFavorites = { ...document?.favorites, [caskId]: true }
      updatedState = 'added'
    }
    this.save(userId, { favorites: updatedFavorites })
    return updatedState
  }

  public async getFavorites(address: string) {
    const collection = await this.collection()
    const document = await collection.findOne<any>({ _id: address })
    const favorites = document?.favorites && Object.keys(document?.favorites)
    return favorites
  }

  public async save(id: string, user: UserRequestModel) {
    const cleanUser = Object.keys(user).reduce((acc: any, key) => {
      if (user[key]) {
        acc[key] = user[key]
      }
      return acc
    }, {})
    await this.persist(id, cleanUser)
  }

  public async search(address: string): Promise<any | null> {
    const collection = await this.collection()
    const document = await collection.findOne<any>({ _id: address })

    return document || null
  }
}
