import { SortType } from '../../../types/filters'
import { Nft } from '../../../types/nft'

export interface NFTRepository {
  createNFT(id: string, nft: any): Promise<any>
  updateNFTFavoriteCounter(id: string, action: string): Promise<any>
  getAllNfts(
    page: number,
    pageSize: number,
    filter: any,
    sort: SortType
  ): Promise<Nft[]>
  addFraction(id: string, fraction: any): Promise<void>
  getTotalNftsSupply(): Promise<number>
  getFavoriteNfts(address: string): Promise<Nft[]>
  getBestNfts(): Promise<Nft[]>
  getNFTFavoriteCounter(id: string): Promise<number>
  getNftTransfers(id: string): Promise<any>
  getNftSalesHistory(id: string): Promise<any>
  getNftOffers(tokenId: string): Promise<any>
  getBalances(address: string): Promise<any>
  getOwnedNfts(owner: string): Promise<Nft[]>
  getCaskInfo(caskId: string): Promise<Nft>
  fractionalizeNft(fractionalizeInfo: any): Promise<void>
  transferNFT(toAddress: string, tokenId: any, index: number): Promise<void>
  updateOwnerNft(id: string, owner: string): Promise<void>
  updatePrice(id: string, price: string): Promise<void>
  updateSaleState(id: string, state: boolean): Promise<void>
}
