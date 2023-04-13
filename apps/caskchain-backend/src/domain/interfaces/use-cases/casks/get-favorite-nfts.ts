import { Nft } from '../../../../types/nft'

export interface GetFavoriteNftsUseCase {
  execute(address: string): Promise<Nft[]>
}
