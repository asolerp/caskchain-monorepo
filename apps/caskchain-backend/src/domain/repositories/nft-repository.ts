import { NFTRepository } from '../interfaces/repository/nft-repository'
import { Web3Transaction } from '../../data/data-sources/blockchain/Web3Transaction'
import { NFTsDataSource } from '../../data/interfaces/data-sources/NFTsDataSource'

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

  async createNFT(id: string, nft: any): Promise<any> {
    this.nftsDataSource.save(id, nft)
  }

  async getNFTFavoriteCounter(id: string): Promise<number> {
    return await this.nftsDataSource.getNFTFavoriteCounter(id)
  }

  async updateNFTFavoriteCounter(id: string, action: string): Promise<number> {
    return await this.nftsDataSource.updateFavoriteCounter(id, action)
  }

  async updateOwnerNft(id: string, owner: string): Promise<void> {
    await this.nftsDataSource.updateOwnerNft(id, owner)
  }

  async updatePrice(id: string, price: string): Promise<void> {
    await this.nftsDataSource.updatePrice(id, price)
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

  async getAllNfts(page: number, pageSize: number, filter?: any): Promise<any> {
    console.log('HOLA', filter)
    return await this.nftsDataSource.getAllNfts(page, pageSize, filter)
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
