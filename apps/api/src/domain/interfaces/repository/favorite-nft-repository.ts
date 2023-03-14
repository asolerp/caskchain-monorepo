export interface FavoriteNFTRepository {
  addFavoriteNFT(caskId: string, address: string): Promise<string>
}
