import { NFTRepository } from '../interfaces/repository/nft-repository'
import { Web3Transaction } from '../../data/data-sources/blockchain/Web3Transaction'
import { NFTsDataSource } from '../../data/interfaces/data-sources/NFTsDataSource'
import { SortType } from '../../types/filters'

export class NFTRepositoryImpl implements NFTRepository {
  web3Transaction: Web3Transaction
  nftsDataSource: NFTsDataSource

  constructor(
    web3Transaction: Web3Transaction,
    nftsDataSource: NFTsDataSource
  ) {
    this.web3Transaction = web3Transaction
    this.nftsDataSource = nftsDataSource
  }

  async addFraction(id: string, fraction: any): Promise<void> {
    await this.nftsDataSource.addFraction(id, fraction)
  }

  async createNFT(id: string, nft: any): Promise<any> {
    this.nftsDataSource.save(id, nft)
  }

  async getNFTFavoriteCounter(id: string): Promise<number> {
    return await this.nftsDataSource.getNFTFavoriteCounter(id)
  }

  async getBestNfts(): Promise<any> {
    return await this.nftsDataSource.getBestNfts()
  }

  async updateNFTFavoriteCounter(id: string, action: string): Promise<number> {
    return await this.nftsDataSource.updateFavoriteCounter(id, action)
  }

  async updateNFTBestBarrels(id: string, state: boolean): Promise<void> {
    await this.nftsDataSource.updateBestBarrels(id, state)
  }

  async updateOwnerNft(id: string, owner: string): Promise<void> {
    await this.nftsDataSource.updateOwnerNft(id, owner)
  }

  async updatePrice(
    id: string,
    price: string,
    erc20Token?: string
  ): Promise<void> {
    await this.nftsDataSource.updatePrice(id, price, erc20Token)
  }

  async updateSaleState(id: string, state: boolean): Promise<void> {
    await this.nftsDataSource.updateSaleState(id, state)
  }

  async getTotalNftsSupply(): Promise<number> {
    return await this.web3Transaction.getTotalNftSupply()
  }

  async getFavoriteNfts(address: string): Promise<any> {
    return await this.web3Transaction.getFavoriteNfts(address)
  }

  async getNftOffers(tokenId: string): Promise<any> {
    return await this.web3Transaction.getNftOffers(tokenId)
  }

  async getNftTransfers(id: string): Promise<any> {
    return await this.web3Transaction.getNftTransfers(id)
  }

  async getNftSalesHistory(id: string): Promise<any> {
    return await this.web3Transaction.getNftSalesHistory(id)
  }

  async getBalances(address: string): Promise<any> {
    return await this.web3Transaction.getBalances(address)
  }

  async getCaskInfo(caskId: string): Promise<any> {
    return await this.web3Transaction.getCaskInfo(caskId)
  }

  async getAllNfts(
    page: number,
    pageSize: number,
    filter?: any,
    sort?: SortType
  ): Promise<any> {
    return await this.nftsDataSource.getAllNfts(page, pageSize, filter, sort)
  }

  async getOwnedNfts(owner: string): Promise<any> {
    return await this.web3Transaction.getOwnedNfts(owner)
  }

  async fractionalizeNft(fractionalizeInfo: any): Promise<void> {
    this.web3Transaction.fractionalizeNft({ fractionInfo: fractionalizeInfo })
  }

  async transferNFT(
    toAddress: string,
    tokenId: string,
    index: number
  ): Promise<any> {
    this.web3Transaction.transferNFT(toAddress, tokenId, index)
  }
}
