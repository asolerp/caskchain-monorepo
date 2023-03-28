import { UserRepository } from '../../interfaces/repository/user-repository'
import { FavoriteNftUseCase } from '../../interfaces/use-cases/casks/favorite-nft'

export class FavoriteNFT implements FavoriteNftUseCase {
  userRepository: UserRepository
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async execute(userId: string, caskId: any) {
    return await this.userRepository.addFavorite(userId, caskId)
  }
}
