import { Nft } from '../../../../types/nft'

export interface GetCaskInfoUseCase {
  execute(caskId: string): Promise<Nft>
}
