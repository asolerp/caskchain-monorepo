import axios from 'axios'
import { isValidAddress } from 'ethereumjs-util'

import NftFractionToken from 'contracts/build/contracts/NftFractionToken.json'

import CCNft from 'contracts/build/contracts/CCNft.json'
import NftFractionsVendor from 'contracts/build/contracts/NftFractionsVendor.json'
import NftFractionsFactory from 'contracts/build/contracts/NftFractionsFactory.json'

import { MongoClientFactory } from '../mongodb/MongoClientFactory'
import { MongoDBUserDataSource } from '../mongodb/MongoDBUserDataSource'

import { Web3Repository } from './Web3Repository'
import getFractionData from './utils/getFractionData'
import logger from '../../../presentation/utils/logger'
import { MongoDBNFTDataSource } from '../mongodb/MongoDBNFTDataSource'

const NETWORK_ID = 4447

export class Web3Transaction extends Web3Repository {
  private async signTransaction(tx: any): Promise<any> {
    return await this.client().eth.accounts.signTransaction(
      tx,
      process.env.PRIVATE_KEY as string
    )
  }

  public async getTotalNftSupply() {
    const CCNft = this.contracts()['CCNft']
    const totalSupply = await CCNft.methods.totalSupply().call()
    return totalSupply
  }

  private async sendSignedTransaction(signedTx: any) {
    try {
      return await this.client().eth.sendSignedTransaction(
        signedTx.rawTransaction
      )
    } catch (e: any) {
      console.log('Error', e)
      throw new Error('Sign Transaction fails')
    }
  }

  public async getCaskInfo(caskId: string) {
    try {
      const client = this.client()
      const clientDB = MongoClientFactory.createClient(
        process.env.CONTEXT_NAME as string,
        {
          url: process.env.MONGO_DB_URL,
        }
      )

      const mongoUserDataSource = new MongoDBUserDataSource(clientDB)
      const mongoNftDataSource = new MongoDBNFTDataSource(clientDB)

      const CCNft = this.contracts()['CCNft']
      const NftVendor = this.contracts()['NftVendor']
      const NftOffers = this.contracts()['NftOffers']
      const NftFractionsFactory = this.contracts()['NftFractionsFactory']
      const NftFractionsVendor = this.contracts()['NftFractionsVendor']

      const nft = await CCNft.methods.getNftInfo(caskId).call()

      if (nft.tokenId === '0') {
        throw new Error('Cask not found')
      }

      const { fractionData, unitPrice, fractionTokenAddress, vaultExists } =
        await getFractionData({
          tokenId: nft.tokenId,
          NftFractionsFactory,
          client,
          NftFractionToken,
          NftFractionsVendor,
        })

      const tokenURI = await CCNft.methods!.tokenURI(caskId).call()

      const owner = await CCNft.methods.ownerOf(caskId).call()

      const isCaskChainOwner = await NftVendor.methods
        .getIsOwnerSameAsCreator(caskId)
        .call()

      const ownerName = await mongoUserDataSource.search(owner.toLowerCase())
      const nftData = await mongoNftDataSource.search(caskId)

      const ipfsHash = tokenURI.split('/ipfs/')[1]

      const meta = await axios
        .get(`${process.env.PINATA_GATEWAY_URL}/${ipfsHash}`, {
          headers: {
            'x-pinata-gateway-token': process.env.PINATA_GATEWAY_TOKEN,
          },
        })
        .then((res) => {
          return res.data
        })
        .catch(() => {
          throw 'Failed to fetch metadata'
        })

      const listedPrice = await NftVendor.methods.getListing(nft.tokenId).call()

      const usdtPrice = await NftVendor.methods
        .getPriceByToken(process.env.USDT_CONTRACT_ADDRESS, nft.tokenId)
        .call()

      const offer = await NftOffers.methods.getNftOffer(nft.tokenId).call()
      let bidders

      if (offer?.nftId != 0) {
        bidders = await NftOffers.methods.getAddressesBids(offer?.nftId).call()
      }
      const cask = {
        tokenId: nft.tokenId,
        creator: nft.creator,
        isCaskChainOwner,
        active: listedPrice.active,
        owner: {
          address: owner,
          nickname: ownerName?.nickname || '',
        },
        fractions: vaultExists
          ? {
              ...(fractionData as any),
              tokenAddress: fractionTokenAddress,
              unitPrice,
            }
          : null,
        price: listedPrice?.price?.toString(),
        erc20Prices: {
          USDT: usdtPrice?.toString(),
        },
        bestBarrel: nftData?.bestBarrel || false,
        offer:
          offer?.nftId != 0
            ? {
                bid: offer?.highestBid?.toString(),
                highestBidder: offer?.highestBidder,
                bidders,
              }
            : null,
        meta,
      }
      return cask
    } catch (e: any) {
      console.log('Error', e)
    }
  }

  public async getAllNfts(page: number, pageSize: number) {
    try {
      const client = this.client()

      const clientDB = MongoClientFactory.createClient(
        process.env.CONTEXT_NAME as string,
        {
          url: process.env.MONGO_DB_URL,
        }
      )

      const mongoUserDataSource = new MongoDBUserDataSource(clientDB)

      const CCNft = this.contracts()['CCNft']
      const NftVendor = this.contracts()['NftVendor']
      const NftOffers = this.contracts()['NftOffers']
      const NftFractionsFactory = this.contracts()['NftFractionsFactory']
      const NftFractionsVendor = this.contracts()['NftFractionsVendor']

      const totalItems = await CCNft.methods.getNftTotalSupply().call()
      const totalPages = Math.ceil(totalItems / pageSize)
      const listNfts = await CCNft.methods.getAllNFTs(page, pageSize).call()

      const nfts = await Promise.all(
        listNfts.map(async function (nft: any) {
          const { fractionData, unitPrice, fractionTokenAddress, vaultExists } =
            await getFractionData({
              tokenId: nft.tokenId,
              NftFractionsFactory,
              client,
              NftFractionToken,
              NftFractionsVendor,
            })

          const tokenURI = await CCNft.methods!.tokenURI(nft.tokenId).call()
          const owner = await CCNft.methods.ownerOf(nft.tokenId).call()

          const ownerName = await mongoUserDataSource.search(
            owner.toLowerCase()
          )

          const ipfsHash = tokenURI.split('/ipfs/')[1]

          const meta = await axios
            .get(`${process.env.PINATA_GATEWAY_URL}/${ipfsHash}`, {
              headers: {
                'x-pinata-gateway-token': process.env.PINATA_GATEWAY_TOKEN,
              },
            })
            .then((res) => {
              return res.data
            })
            .catch((err) => {
              logger.error('Error fetching metadata from IPFS', err.message, {
                metadata: {
                  service: 'web3-transactions',
                },
              })
              return null
            })
          const listedPrice = await NftVendor.methods
            .getListing(nft.tokenId)
            .call()
          const offer = await NftOffers.methods.getNftOffer(nft.tokenId).call()
          let bidders

          if (offer?.nftId != 0) {
            bidders = await NftOffers.methods
              .getAddressesBids(offer?.nftId)
              .call()
          }

          return {
            tokenId: nft.tokenId,
            creator: nft.creator,
            fractions: vaultExists
              ? {
                  ...(fractionData as any),
                  tokenAddress: fractionTokenAddress,
                  unitPrice,
                }
              : null,
            owner: {
              address: owner,
              nickname: ownerName?.nickname || '',
            },
            price: listedPrice?.price?.toString(),
            offer:
              offer?.nftId != 0
                ? {
                    bid: offer?.highestBid?.toString(),
                    highestBidder: offer?.highestBidder,
                    bidders,
                  }
                : null,
            meta,
          }
        })
      )

      return { items: nfts, totalPages, currentPage: page, totalItems }
    } catch (e: any) {
      console.error(e)
    }
  }

  public async getNftOffers(tokenId: string) {
    const NftOffers = this.contracts()['NftOffers']

    const clientDB = MongoClientFactory.createClient(
      process.env.CONTEXT_NAME as string,
      {
        url: process.env.MONGO_DB_URL,
      }
    )

    const mongoUserDataSource = new MongoDBUserDataSource(clientDB)

    try {
      const events = await NftOffers.getPastEvents('NewOffer', {
        filter: { tokenId },
        fromBlock: 0,
        toBlock: 'latest',
      })
      const latestOffers = events.map(async (event: any) => {
        const ownerName = await mongoUserDataSource.search(
          event.returnValues.bidder.toLowerCase()
        )

        const block = await this.client().eth.getBlock(event.blockNumber)
        return {
          tokenId: event.returnValues.tokenId,
          bidder: ownerName?.nickname || '',
          txHash: event.transactionHash,
          timestamp: (block.timestamp as number) * 1000,
          offer: event.returnValues.bid,
        }
      })
      const lOffers = await Promise.all(latestOffers)
      return lOffers.sort((a: any, b: any) => b.timestamp - a.timestamp)
    } catch (e: any) {
      console.error(e)
    }
  }

  public async getNftSalesHistory(tokenId: string) {
    const NftVendor = this.contracts()['NftVendor']
    const NftOffers = this.contracts()['NftOffers']

    try {
      const clientDB = MongoClientFactory.createClient(
        process.env.CONTEXT_NAME as string,
        {
          url: process.env.MONGO_DB_URL,
        }
      )

      const mongoUserDataSource = new MongoDBUserDataSource(clientDB)

      const eventsItemBought = await NftVendor.getPastEvents('ItemBought', {
        filter: { tokenId },
        fromBlock: 0,
        toBlock: 'latest',
      })

      const eventsAcceptOffer = await NftOffers.getPastEvents('AcceptOffer', {
        filter: { tokenId },
        fromBlock: 0,
        toBlock: 'latest',
      })

      const itemsBought = eventsItemBought.map(async (event: any) => {
        const fromNickname = await mongoUserDataSource.search(
          event.returnValues.from.toLowerCase()
        )
        const toNickname = await mongoUserDataSource.search(
          event.returnValues.to.toLowerCase()
        )

        const block = await this.client().eth.getBlock(event.blockNumber)
        return {
          tokenId: event.returnValues.tokenId,
          from: fromNickname?.nickname || '',
          to: toNickname?.nickname || '',
          txHash: event.transactionHash,
          timestamp: (block.timestamp as number) * 1000,
          purchasePrice: event.returnValues.price,
        }
      })

      const offersAccepted = eventsAcceptOffer.map(async (event: any) => {
        const fromNickname = await mongoUserDataSource.search(
          event.returnValues.owner.toLowerCase()
        )
        const toNickname = await mongoUserDataSource.search(
          event.returnValues.bidder.toLowerCase()
        )
        const block = await this.client().eth.getBlock(event.blockNumber)
        return {
          tokenId: event.returnValues.tokenId,
          from: fromNickname?.nickname || '',
          to: toNickname?.nickname || '',
          txHash: event.transactionHash,
          timestamp: (block.timestamp as number) * 1000,
          purchasePrice: event.returnValues.bid,
        }
      })

      return await Promise.all([...itemsBought, ...offersAccepted])
    } catch (e: any) {
      console.error(e)
    }
  }

  public async getNftTransfers(tokenId: string) {
    const CCNft = this.contracts()['CCNft']
    try {
      const events = await CCNft.getPastEvents('Transfer', {
        filter: { tokenId },
        fromBlock: 0,
        toBlock: 'latest',
      })
      const transferHistory = events.map(async (event: any) => {
        const block = await this.client().eth.getBlock(event.blockNumber)
        return {
          tokenId: event.returnValues.tokenId,
          from: event.returnValues.from,
          to: event.returnValues.to,
          txHash: event.transactionHash,
          timestamp: (block.timestamp as number) * 1000,
        }
      })

      return await Promise.all(transferHistory)
    } catch (e: any) {
      console.error(e)
    }
  }

  public async getFavoriteNfts(account: string) {
    try {
      const clientDB = MongoClientFactory.createClient(
        process.env.CONTEXT_NAME as string,
        {
          url: process.env.MONGO_DB_URL,
        }
      )

      const mongoUserDataSource = new MongoDBUserDataSource(clientDB)

      const client = this.client()
      const CCNft = this.contracts()['CCNft']
      const NftVendor = this.contracts()['NftVendor']
      const NftOffers = this.contracts()['NftOffers']
      const NftFractionsFactoryContract =
        this.contracts()['NftFractionsFactory']
      const NftFractionsVendorContract = this.contracts()['NftFractionsVendor']

      const listNfts = await mongoUserDataSource.getFavorites(account)

      if (!listNfts) return null

      const nfts = await Promise.all(
        listNfts?.map(async function (nftId: string) {
          const { fractionData, unitPrice, fractionTokenAddress, vaultExists } =
            await getFractionData({
              tokenId: nftId,
              NftFractionsFactory: NftFractionsFactoryContract,
              client,
              NftFractionToken,
              NftFractionsVendor: NftFractionsVendorContract,
            })

          const tokenURI = await CCNft.methods!.tokenURI(nftId).call()
          const creator = await CCNft.methods.owner().call()
          const owner = await CCNft.methods.ownerOf(nftId).call()
          const meta = await axios
            .get(tokenURI, {
              headers: {
                'x-pinata-gateway-token': process.env.PINATA_GATEWAY_TOKEN,
              },
            })
            .then((res) => {
              return res.data
            })
            .catch(() => {
              return {
                description:
                  'El secreto de su exquisita calidad descansa en el tiempo, el silencio y el microclima de nuestras bodegas subterráneas acorazadas por un muro de un metro y ochenta centímetros intraspasable por los olores y los ruidos.',
                image:
                  'https://gateway.pinata.cloud/ipfs/QmNqh9WW1qmzU9CtD6ZjtvD9P2ZQJTbUU7SDjwEDnpFJni',
                name: 'Classic Cask Brandy Suau SIN INFO',
                attributes: [
                  { trait_type: 'year', value: '1990' },
                  { trait_type: 'extractions', value: '0' },
                  { trait_type: 'country', value: 'Spain' },
                  { trait_type: 'region', value: 'Balearic Islands' },
                ],
              }
            })
          const listedPrice = await NftVendor.methods.getListing(nftId).call()
          const offer = await NftOffers.methods.getNftOffer(nftId).call()
          const ownerName = await mongoUserDataSource.search(
            owner.toLowerCase()
          )
          let bidders

          if (offer?.nftId != 0) {
            bidders = await NftOffers.methods
              .getAddressesBids(offer?.nftId)
              .call()
          }

          return {
            tokenId: nftId,
            creator,
            fractions: vaultExists
              ? {
                  ...(fractionData as any),
                  tokenAddress: fractionTokenAddress,
                  unitPrice,
                }
              : null,
            owner: {
              address: owner,
              nickname: ownerName?.nickname || '',
            },
            price: listedPrice?.price?.toString(),
            offer:
              offer?.nftId != 0
                ? {
                    bid: offer?.highestBid?.toString(),
                    highestBidder: offer?.highestBidder,
                    bidders,
                  }
                : null,
            meta,
          }
        })
      )

      return nfts
    } catch (e: any) {
      console.error(e)
    }
  }

  public async getOwnedNfts(account: string) {
    try {
      const client = this.client()
      const CCNft = this.contracts()['CCNft']
      const NftVendor = this.contracts()['NftVendor']
      const NftOffers = this.contracts()['NftOffers']
      const NftFractionsFactory = this.contracts()['NftFractionsFactory']
      const NftFractionsVendor = this.contracts()['NftFractionsVendor']

      const clientDB = MongoClientFactory.createClient(
        process.env.CONTEXT_NAME as string,
        {
          url: process.env.MONGO_DB_URL,
        }
      )

      const mongoUserDataSource = new MongoDBUserDataSource(clientDB)

      const listNfts = await CCNft.methods
        .getOwnedNfts()
        .call({ from: account })

      const nfts = await Promise.all(
        listNfts.map(async function (nft: any) {
          const { fractionData, unitPrice, fractionTokenAddress, vaultExists } =
            await getFractionData({
              tokenId: nft.tokenId,
              NftFractionsFactory,
              client,
              NftFractionToken,
              NftFractionsVendor,
            })

          const tokenURI = await CCNft.methods!.tokenURI(nft.tokenId).call()
          const owner = await CCNft.methods.ownerOf(nft.tokenId).call()

          const ownerName = await mongoUserDataSource.search(
            owner.toLowerCase()
          )
          const ipfsHash = tokenURI.split('/ipfs/')[1]

          const meta = await axios
            .get(`${process.env.PINATA_GATEWAY_URL}/${ipfsHash}`, {
              headers: {
                'x-pinata-gateway-token': process.env.PINATA_GATEWAY_TOKEN,
              },
            })
            .then((res) => {
              return res.data
            })
            .catch((err) => {
              logger.error('Error fetching metadata from IPFS', err.message, {
                metadata: {
                  service: 'web3-transactions',
                },
              })
              return null
            })
          const listedPrice = await NftVendor.methods
            .getListing(nft.tokenId)
            .call()
          const offer = await NftOffers.methods.getNftOffer(nft.tokenId).call()
          let bidders

          if (offer?.nftId != 0) {
            bidders = await NftOffers.methods
              .getAddressesBids(offer?.nftId)
              .call()
          }

          return {
            tokenId: nft.tokenId,
            creator: nft.creator,
            fractions: vaultExists
              ? {
                  ...(fractionData as any),
                  tokenAddress: fractionTokenAddress,
                  unitPrice,
                }
              : null,
            owner: {
              address: owner,
              nickname: ownerName?.nickname || '',
            },
            price: listedPrice?.price?.toString(),
            offer:
              offer?.nftId != 0
                ? {
                    bid: offer?.highestBid?.toString(),
                    highestBidder: offer?.highestBidder,
                    bidders,
                  }
                : null,
            meta,
          }
        })
      )

      return nfts
    } catch (e: any) {
      console.error(e)
    }
  }

  public async fractionalizeNft({ fractionInfo }: { fractionInfo: any }) {
    try {
      const { name, symbol, collection, tokenId, supply, fee, listingPrice } =
        fractionInfo

      const client = this.client()
      const ccNftContract = this.contracts()['CCNft']
      const nftFractionsVendorContract = this.contracts()['NftFractionsVendor']
      const nftFractionsFactoryContract =
        this.contracts()['NftFractionsFactory']

      let initialNonce: number | null = await client.eth.getTransactionCount(
        process.env.PUBLIC_KEY as string,
        'latest'
      )

      const createTransaction = async (transactionData: any) => {
        const signedTransaction = await this.signTransaction(transactionData)
        const transactionHash = await this.sendSignedTransaction(
          signedTransaction
        )

        if (!transactionHash.status) {
          throw new Error('Error processing transaction')
        }

        return transactionHash
      }

      // Aprove NFT Fractions Factory
      await createTransaction({
        from: process.env.PUBLIC_KEY,
        to: CCNft.networks[4447].address,
        gas: 30000000,
        nonce: initialNonce++,
        maxPriorityFeePerGas: 2999999987,
        value: 0,
        data: ccNftContract.methods
          .approve(NftFractionsFactory.networks[NETWORK_ID].address, tokenId)
          .encodeABI(),
      })

      // Create NFT Fraction Token
      await createTransaction({
        from: process.env.PUBLIC_KEY,
        to: NftFractionsFactory.networks[NETWORK_ID].address,
        gas: 30000000,
        nonce: initialNonce++,
        maxPriorityFeePerGas: 2999999987,
        value: 0,
        data: nftFractionsFactoryContract.methods
          .mint(name, symbol, collection, tokenId, supply, fee, listingPrice)
          .encodeABI(),
      })

      // Get created vault address
      const vault = await nftFractionsFactoryContract.methods
        .getVaultContractByTokenId(tokenId)
        .call()

      // Transfer all tokens to vault vendor
      const tokenContract = new client.eth.Contract(
        NftFractionToken.abi as any,
        vault.vaultAddress
      )

      await createTransaction({
        from: process.env.PUBLIC_KEY,
        to: vault.vaultAddress,
        gas: 30000000,
        nonce: initialNonce++,
        maxPriorityFeePerGas: 2999999987,
        value: 0,
        data: tokenContract.methods
          .transfer(NftFractionsVendor.networks?.[NETWORK_ID].address, supply)
          .encodeABI(),
      })

      // Update Token Price in Vendor
      await createTransaction({
        from: process.env.PUBLIC_KEY,
        to: NftFractionsVendor.networks?.[NETWORK_ID].address,
        gas: 30000000,
        nonce: initialNonce++,
        maxPriorityFeePerGas: 2999999987,
        value: 0,
        data: nftFractionsVendorContract.methods
          .updateTokenVendor(vault.vaultAddress, supply, listingPrice, true)
          .encodeABI(),
      })

      // Update Sale Status Token
      await createTransaction({
        from: process.env.PUBLIC_KEY,
        to: vault.vaultAddress,
        gas: 30000000,
        nonce: initialNonce++,
        maxPriorityFeePerGas: 2999999987,
        value: 0,
        data: tokenContract.methods.updateSaleState(true).encodeABI(),
      })
    } catch (e: any) {
      console.log('Error', e)
    }
  }

  public async transferNFT(toAddress: string, tokenId: string, index: number) {
    try {
      let initialNonce: number | null = null

      const nftContract = this.contracts()['CCNft']

      if (!initialNonce) {
        initialNonce = await this.client().eth.getTransactionCount(
          process.env.PUBLIC_KEY as string,
          'latest'
        )
      }

      const nonce = initialNonce + index

      const tx = {
        from: process.env.PUBLIC_KEY,
        to: process.env.NFT_CONTRACT_ADDRESS,
        gas: 30000000,
        nonce,
        maxPriorityFeePerGas: 2999999987,
        value: 0,
        data: nftContract.methods
          .transferFrom(process.env.PUBLIC_KEY, toAddress, tokenId)
          .encodeABI(),
      }

      const signedTx = await this.signTransaction(tx)
      const hash = await this.sendSignedTransaction(signedTx)

      return hash
    } catch (e: any) {
      throw new Error('Transfer nft fails')
    }
  }

  public isValidAddress(address: string): boolean {
    return isValidAddress(address)
  }

  public async getBalances(address: string) {
    const client = this.client()
    const NftFractionsFactory = this.contracts()['NftFractionsFactory']
    const fractionsAddress = await NftFractionsFactory.methods
      .getAllCreatedVaults()
      .call()

    const balances = Promise.all(
      fractionsAddress.map(async (faddress: string) => {
        const contract = new client.eth.Contract(
          NftFractionToken.abi as any,
          faddress
        )

        const tokenName = await contract.methods.name().call()
        const tokenSymbol = await contract.methods.symbol().call()

        const balanceAddress = await contract.methods.balanceOf(address).call()

        return {
          name: tokenName,
          symbol: tokenSymbol,
          address: faddress,
          balance: balanceAddress,
        }
      })
    )
    return balances
  }
}
