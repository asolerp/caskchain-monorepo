import { UserRequestModel } from '../../model/User'

export interface SaveUserUseCase {
  execute(id: string, user: UserRequestModel): Promise<void>
}
