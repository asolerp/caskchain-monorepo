import { UserRequestModel, UserResponseModel } from '../../model/User'

export interface UserRepository {
  getUser(address: string): Promise<UserResponseModel | null>
  addFavorite(userId: string, caskId: string): Promise<string>
  createUser(id: string, user: UserRequestModel): Promise<UserResponseModel>
}
