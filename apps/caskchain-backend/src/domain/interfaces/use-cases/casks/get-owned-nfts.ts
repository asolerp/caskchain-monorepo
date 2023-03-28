import { Nft } from '../../../../types/nft'

export interface GetOwnedNftsUseCase {
  execute(owner: string): Promise<Nft[]>
}
