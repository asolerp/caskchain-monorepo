import { IncrementTotalUsersUseCase } from '../../domain/interfaces/use-cases/stats/increment-total-users-use-case'

export default function UserDBWatcher(
  incrementTotalUsersUseCase: IncrementTotalUsersUseCase
) {
  const incrementTotalUsers = async () => {
    await incrementTotalUsersUseCase.execute()
  }

  return {
    incrementTotalUsers,
  }
}
