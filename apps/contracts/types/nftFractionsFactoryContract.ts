import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from 'ethers';
import { EthersContractContextV5 } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContextV5<
  NftFractionsFactoryContract,
  NftFractionsFactoryContractMethodNames,
  NftFractionsFactoryContractEventsContext,
  NftFractionsFactoryContractEvents
>;

export declare type EventFilter = {
  address?: string;
  topics?: Array<string>;
  fromBlock?: string | number;
  toBlock?: string | number;
};

export interface ContractTransactionOverrides {
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number;
  /**
   * The price (in wei) per unit of gas
   */
  gasPrice?: BigNumber | string | number | Promise<any>;
  /**
   * The nonce to use in the transaction
   */
  nonce?: number;
  /**
   * The amount to send with the transaction (i.e. msg.value)
   */
  value?: BigNumber | string | number | Promise<any>;
  /**
   * The chain ID (or network ID) to use
   */
  chainId?: number;
}

export interface ContractCallOverrides {
  /**
   * The address to execute the call as
   */
  from?: string;
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number;
}
export type NftFractionsFactoryContractEvents =
  | 'AdminChanged'
  | 'BeaconUpgraded'
  | 'Initialized'
  | 'Mint'
  | 'OwnershipTransferred'
  | 'Paused'
  | 'Unpaused'
  | 'Upgraded';
export interface NftFractionsFactoryContractEventsContext {
  AdminChanged(...parameters: any): EventFilter;
  BeaconUpgraded(...parameters: any): EventFilter;
  Initialized(...parameters: any): EventFilter;
  Mint(...parameters: any): EventFilter;
  OwnershipTransferred(...parameters: any): EventFilter;
  Paused(...parameters: any): EventFilter;
  Unpaused(...parameters: any): EventFilter;
  Upgraded(...parameters: any): EventFilter;
}
export type NftFractionsFactoryContractMethodNames =
  | 'activeAddressVendor'
  | 'logic'
  | 'nftToVault'
  | 'owner'
  | 'paused'
  | 'proxiableUUID'
  | 'renounceOwnership'
  | 'tokenAddressCreated'
  | 'tokens'
  | 'transferOwnership'
  | 'upgradeTo'
  | 'upgradeToAndCall'
  | 'vaultCount'
  | 'vaults'
  | 'initialize'
  | 'mint'
  | 'vaultExists'
  | 'getVaultContractByTokenId'
  | 'getAllCreatedVaults'
  | 'getVaultContract'
  | 'pause'
  | 'unpause';
export interface AdminChangedEventEmittedResponse {
  previousAdmin: string;
  newAdmin: string;
}
export interface BeaconUpgradedEventEmittedResponse {
  beacon: string;
}
export interface InitializedEventEmittedResponse {
  version: BigNumberish;
}
export interface MintEventEmittedResponse {
  token: string;
  id: BigNumberish;
  price: BigNumberish;
  vault: string;
  vaultId: BigNumberish;
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface PausedEventEmittedResponse {
  account: string;
}
export interface UnpausedEventEmittedResponse {
  account: string;
}
export interface UpgradedEventEmittedResponse {
  implementation: string;
}
export interface TokensResponse {
  tokenAddress: string;
  0: string;
  totalSupply: BigNumber;
  1: BigNumber;
  listingPrice: BigNumber;
  2: BigNumber;
  enableSell: boolean;
  3: boolean;
  length: 4;
}
export interface VaultsResponse {
  vaultAddress: string;
  0: string;
  count: BigNumber;
  1: BigNumber;
  length: 2;
}
export interface VaultResponse {
  vaultAddress: string;
  0: string;
  count: BigNumber;
  1: BigNumber;
}
export interface NftFractionsFactoryContract {
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   */
  activeAddressVendor(
    parameter0: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  logic(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   * @param parameter1 Type: uint256, Indexed: false
   */
  nftToVault(
    parameter0: string,
    parameter1: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  owner(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  paused(overrides?: ContractCallOverrides): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  proxiableUUID(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  renounceOwnership(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   */
  tokenAddressCreated(
    parameter0: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   */
  tokens(
    parameter0: string,
    overrides?: ContractCallOverrides
  ): Promise<TokensResponse>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newOwner Type: address, Indexed: false
   */
  transferOwnership(
    newOwner: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newImplementation Type: address, Indexed: false
   */
  upgradeTo(
    newImplementation: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param newImplementation Type: address, Indexed: false
   * @param data Type: bytes, Indexed: false
   */
  upgradeToAndCall(
    newImplementation: string,
    data: Arrayish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  vaultCount(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   */
  vaults(
    parameter0: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<VaultsResponse>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  initialize(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _name Type: string, Indexed: false
   * @param _symbol Type: string, Indexed: false
   * @param _token Type: address, Indexed: false
   * @param _id Type: uint256, Indexed: false
   * @param _supply Type: uint256, Indexed: false
   * @param _fee Type: uint256, Indexed: false
   * @param _listPrice Type: uint256, Indexed: false
   */
  mint(
    _name: string,
    _symbol: string,
    _token: string,
    _id: BigNumberish,
    _supply: BigNumberish,
    _fee: BigNumberish,
    _listPrice: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _token Type: address, Indexed: false
   * @param nftId Type: uint256, Indexed: false
   */
  vaultExists(
    _token: string,
    nftId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _tokenId Type: uint256, Indexed: false
   */
  getVaultContractByTokenId(
    _tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<VaultResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAllCreatedVaults(overrides?: ContractCallOverrides): Promise<string[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _id Type: uint256, Indexed: false
   */
  getVaultContract(
    _id: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<VaultResponse>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  pause(overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  unpause(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
}
