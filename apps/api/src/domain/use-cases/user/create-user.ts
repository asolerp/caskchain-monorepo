import { UserRepository } from '../../interfaces/repository/user-repository'

import { SaveUserUseCase } from '../../interfaces/use-cases/save-user'
import { UserRequestModel } from '../../model/User'

export class CreateUser implements SaveUserUseCase {
  userRepository: UserRepository
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async execute(id: string, user: UserRequestModel) {
    await this.userRepository.createUser(id, user)
  }
}
