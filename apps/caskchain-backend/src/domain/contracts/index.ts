import CCNft from 'contracts/build/contracts/CCNft.json'
import NftVendor from 'contracts/build/contracts/NftVendor.json'
import NftOffers from 'contracts/build/contracts/NftOffers.json'
import NftFractionsFactory from 'contracts/build/contracts/NftFractionsFactory.json'
import NftFractionsVendor from 'contracts/build/contracts/NftFractionsVendor.json'

export const getContractData = (
  contract: { networks?: any; abi: any },
  contractName: string
) => ({
  contractName,
  contractAddress: contract.networks?.[process.env.NETWORK_ID as string]
    .address as string,
  contractABI: contract.abi,
})

export const contracts = [
  { contract: CCNft, name: 'CCNft' },
  { contract: NftVendor, name: 'NftVendor' },
  { contract: NftOffers, name: 'NftOffers' },
  { contract: NftFractionsFactory, name: 'NftFractionsFactory' },
  { contract: NftFractionsVendor, name: 'NftFractionsVendor' },
]
