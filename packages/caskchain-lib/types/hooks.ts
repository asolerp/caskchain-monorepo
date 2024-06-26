import { CcNftContract } from "./ccNftContract";
// import { NftFractionTokenContract } from './nftFractionTokenContract'
import { NftOffersContract } from "./nftOffersContract";
import { NftVendorContract } from "./nftVendorContract";
import { VaultFactoryContract } from "./vaultFactoryContract";
import { VaultVendorContract } from "./vaultVendorContract";

export type Web3Dependencies = {
  hooksSetter?: any;
  web3Modal?: any;
  setIsConnected: any;
  erc20Contracts?: any;
  nftFractionsVendor?: VaultVendorContract;
  nftFractionsFactory?: VaultFactoryContract;
  nftFractionToken?: any;
  nftOffers?: NftOffersContract;
  provider: any | undefined;
  ccNft: CcNftContract;
  nftVendor: NftVendorContract;
  ethereum: any | undefined;
  isLoading: boolean;
};

export type CryptoHookFactory<D = any, R = any, P = any> = {
  (d: Partial<Web3Dependencies>): CryptoHandlerHook<D, R, P>;
};

export type GeneralHookFactory<D = any, R = any, P = any> = {
  (): CryptoHandlerHook<D, R, P>;
};

export type CryptoHandlerHook<D = any, R = any, P = any> = (params?: P) => any;
