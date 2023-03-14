import { UserRepository } from '../../interfaces/repository/user-repository'
import { GetUserUseCase } from '../../interfaces/use-cases/get-user'

export class GetUser implements GetUserUseCase {
  userRepository: UserRepository
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async execute(address: string) {
    const result = await this.userRepository.getUser(address)
    return result
  }
}
