import { UserRepository } from '../interfaces/repository/user-repository'
import { UsersDataSource } from '../../data/interfaces/data-sources/UsersDataSource'
import { UserRequestModel, UserResponseModel } from '../model/User'

export class UserRepositoryImpl implements UserRepository {
  userDataSource: UsersDataSource
  constructor(userDataSource: UsersDataSource) {
    this.userDataSource = userDataSource
  }

  async addFavorite(userId: string, caskId: string): Promise<string> {
    return await this.userDataSource.addFavorite(userId, caskId)
  }

  async createUser(id: string, user: UserRequestModel): Promise<any> {
    await this.userDataSource.save(id, user)
  }

  async getUser(address: string): Promise<UserResponseModel | null> {
    const result = await this.userDataSource.search(address)
    return result
  }
}
