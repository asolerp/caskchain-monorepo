// data/data-sources/contact-data-source.ts

export interface FavoriteNFTDataSource {
  save(caskId: string, address: string): Promise<void>
  search(caskId: string): Promise<any>
}
