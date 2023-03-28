import { UserResponseModel } from "../../model/User";


export interface GetUserUseCase {
    execute(address: string): Promise<UserResponseModel | null>;
}