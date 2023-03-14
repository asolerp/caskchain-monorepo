import { MetaMaskInpageProvider } from '@metamask/providers'
import { providers } from 'ethers'
import { SWRResponse } from 'swr'
import { CcNftContract } from './ccNftContract'
// import { NftFractionTokenContract } from './nftFractionTokenContract'
import { NftOffersContract } from './nftOffersContract'
import { NftVendorContract } from './nftVendorContract'
import { VaultFactoryContract } from './vaultFactoryContract'
import { VaultVendorContract } from './vaultVendorContract'

export type Web3Dependencies = {
  erc20Contracts?: any
  nftFractionsVendor?: VaultVendorContract
  nftFractionsFactory?: VaultFactoryContract
  nftFractionToken?: any
  nftOffers?: NftOffersContract
  provider: providers.Web3Provider
  ccNft: CcNftContract
  nftVendor: NftVendorContract
  ethereum: MetaMaskInpageProvider
  isLoading: boolean
}

export type CryptoHookFactory<D = any, R = any, P = any> = {
  (d: Partial<Web3Dependencies>): CryptoHandlerHook<D, R, P>
}

export type GeneralHookFactory<D = any, R = any, P = any> = {
  (): CryptoHandlerHook<D, R, P>
}

export type CryptoHandlerHook<D = any, R = any, P = any> = (
  params?: P
) => CryptoSWRResponse<D, R>

export type CryptoSWRResponse<D = any, R = any> = SWRResponse<D> & R
