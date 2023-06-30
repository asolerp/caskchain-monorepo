import { ethers } from 'ethers'
import NftFractionsVendor from 'contracts/build/contracts/NftFractionsVendor.json'

export class Fraction {
  private _contract: any
  private _tokenId: string
  public tokenAddress: string

  constructor(
    fractionTokenContract: any,
    fractionTokenAddress: string,
    tokenId: string
  ) {
    this._contract = fractionTokenContract
    this._tokenId = tokenId
    this.tokenAddress = fractionTokenAddress
  }

  getFractionTokenName = async () => {
    return await this._contract.methods.name().call()
  }

  getFractionTokenSymbol = async () => {
    return await this._contract.methods.symbol().call()
  }

  getTotalFractions = async () => {
    return await this._contract.methods.totalSupply().call()
  }

  getAvailableFractions = async () => {
    return await this._contract.methods
      .balanceOf(NftFractionsVendor.networks?.[4447]?.address)
      .call()
  }

  getLitingPrice = async () => {
    return await this._contract.methods.price().call()
  }

  getListOfHolders = async () => {
    const event = await this._contract
      .getPastEvents('Transfer', {
        filter: {
          myIndexedParam: [20, 23],
          myOtherIndexedParam: '0x123456789...',
        }, // Using an array means OR: e.g. 20 or 23
        fromBlock: 0,
        toBlock: 'latest',
      })
      .then(function (events: any) {
        return events.map((e: any) => e.returnValues) // same results as the optional callback above
      })

    const holders = event.reduce((acc: any, curr: any, i: number) => {
      if (i === 0) {
        return {
          ...acc,
          [curr.from]: '0',
          [curr.to]: curr.value,
        }
      } else {
        return {
          ...acc,
          [curr.from]: (Number(acc[curr.from]) - Number(curr.value)).toString(),
          [curr.to]: (
            Number(acc[curr.to] || 0) + Number(curr.value)
          ).toString(),
        }
      }
    }, {})

    return Object.fromEntries(
      Object.entries(holders)
        .filter(
          ([address]) =>
            address !== '0x0000000000000000000000000000000000000000'
        )
        .filter(([, balance]: any) => balance > 0)
    )
  }

  getForSaleFractions = async () => {
    return await this._contract.methods.forSale().call()
  }

  getFractionData = async () => {
    const fractionTokenSymbol = await this.getFractionTokenSymbol()
    const fractionTokenName = await this.getFractionTokenName()
    const fractionHolders = await this.getListOfHolders()
    const totalFractions = await this.getTotalFractions()
    const availableFractions = await this.getAvailableFractions()
    const listingPrice = await this.getLitingPrice()
    const isForSale = await this.getForSaleFractions()

    return {
      name: fractionTokenName,
      symbol: fractionTokenSymbol,
      holders: fractionHolders,
      total: Number(ethers.utils.formatEther(totalFractions.toString())),
      available: Number(
        ethers.utils.formatEther(availableFractions.toString())
      ),
      listingPrice,
      isForSale,
    }
  }
}

// const fractionTokenAddress = await NftFractionsFactory.methods
//   .getVaultContractByTokenId(nft.tokenId)
//   .call()

// if (fractionTokenAddress !== nullAddress) {
//   fractionTokenContract = new client.eth.Contract(
//     NftFractionTokenABI as any,
//     fractionTokenAddress
//   )
// }
