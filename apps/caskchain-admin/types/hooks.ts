import { SWRResponse } from 'swr'

export type Web3Dependencies = {
  web3Modal?: any
  erc20Contracts?: any
  nftFractionsVendor?: any
  nftFractionsFactory?: any
  nftFractionToken?: any
  nftOffers?: any
  provider: any | undefined
  ccNft: any
  nftVendor: any
  ethereum: any | undefined
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
