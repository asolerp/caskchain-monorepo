import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from 'ethers';
import { EthersContractContextV5 } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContextV5<
  NftFractionsVendorContract,
  NftFractionsVendorContractMethodNames,
  NftFractionsVendorContractEventsContext,
  NftFractionsVendorContractEvents
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
export type NftFractionsVendorContractEvents =
  | 'BuyTokens'
  | 'OwnershipTransferred';
export interface NftFractionsVendorContractEventsContext {
  BuyTokens(...parameters: any): EventFilter;
  OwnershipTransferred(...parameters: any): EventFilter;
}
export type NftFractionsVendorContractMethodNames =
  | 'new'
  | 'activeAddressVendor'
  | 'owner'
  | 'renounceOwnership'
  | 'tokens'
  | 'transferOwnership'
  | 'updateTokenVendor'
  | 'updateTokenVendorSellState'
  | 'updateStateAddressVendor'
  | 'getUnitPrice'
  | 'buyTokens'
  | 'sellTokens'
  | 'withdraw';
export interface BuyTokensEventEmittedResponse {
  buyer: string;
  amountOfMATIC: BigNumberish;
  amountOfTokens: BigNumberish;
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
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
export interface NftFractionsVendorContract {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   */
  'new'(overrides?: ContractTransactionOverrides): Promise<ContractTransaction>;
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
  owner(overrides?: ContractCallOverrides): Promise<string>;
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
   * @param tokenAddress Type: address, Indexed: false
   * @param totalSupply Type: uint256, Indexed: false
   * @param listingPrice Type: uint256, Indexed: false
   * @param enableSell Type: bool, Indexed: false
   */
  updateTokenVendor(
    tokenAddress: string,
    totalSupply: BigNumberish,
    listingPrice: BigNumberish,
    enableSell: boolean,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenAddress Type: address, Indexed: false
   * @param state Type: bool, Indexed: false
   */
  updateTokenVendorSellState(
    tokenAddress: string,
    state: boolean,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenAddress Type: address, Indexed: false
   * @param state Type: bool, Indexed: false
   */
  updateStateAddressVendor(
    tokenAddress: string,
    state: boolean,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenAddress Type: address, Indexed: false
   */
  getUnitPrice(
    tokenAddress: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param tokenAddress Type: address, Indexed: false
   */
  buyTokens(
    tokenAddress: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenAmountToSell Type: uint256, Indexed: false
   * @param tokenAddress Type: address, Indexed: false
   */
  sellTokens(
    tokenAmountToSell: BigNumberish,
    tokenAddress: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  withdraw(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
}
