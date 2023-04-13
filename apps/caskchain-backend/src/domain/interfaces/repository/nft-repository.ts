import { Nft } from '../../../types/nft'

export interface NFTRepository {
  createNFT(id: string, nft: any): Promise<any>
  updateNFTFavoriteCounter(id: string, action: string): Promise<any>
  getAllNfts(): Promise<Nft[]>
  getFavoriteNfts(address: string): Promise<Nft[]>
  getNFTFavoriteCounter(id: string): Promise<number>
  getBalances(address: string): Promise<any>
  getOwnedNfts(owner: string): Promise<Nft[]>
  getCaskInfo(caskId: string): Promise<Nft>
  fractionalizeNft(fractionalizeInfo: any): Promise<void>
  transferNFT(toAddress: string, tokenId: any, index: number): Promise<void>
  updateOwnerNft(id: string, owner: string): Promise<void>
}
