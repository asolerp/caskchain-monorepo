import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumberish,
} from "ethers";
import { EthersContractContextV5 } from "ethereum-abi-types-generator";

export type ContractContext = EthersContractContextV5<
  NftOffersContract,
  NftOffersContractMethodNames,
  NftOffersContractEventsContext,
  NftOffersContractEvents
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
  gasPrice?: BigNumberish | string | number | Promise<any>;
  /**
   * The nonce to use in the transaction
   */
  nonce?: number;
  /**
   * The amount to send with the transaction (i.e. msg.value)
   */
  value?: BigNumberish | string | number | Promise<any>;
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
export type NftOffersContractEvents =
  | "AcceptOffer"
  | "AdminChanged"
  | "BeaconUpgraded"
  | "Initialized"
  | "NewOffer"
  | "OwnershipTransferred"
  | "RemoveOffer"
  | "Upgraded"
  | "Withdraw";
export interface NftOffersContractEventsContext {
  AcceptOffer(...parameters: any): EventFilter;
  AdminChanged(...parameters: any): EventFilter;
  BeaconUpgraded(...parameters: any): EventFilter;
  Initialized(...parameters: any): EventFilter;
  NewOffer(...parameters: any): EventFilter;
  OwnershipTransferred(...parameters: any): EventFilter;
  RemoveOffer(...parameters: any): EventFilter;
  Upgraded(...parameters: any): EventFilter;
  Withdraw(...parameters: any): EventFilter;
}
export type NftOffersContractMethodNames =
  | "collection"
  | "creator"
  | "nftVendor"
  | "owner"
  | "proxiableUUID"
  | "renounceOwnership"
  | "transferOwnership"
  | "upgradeTo"
  | "upgradeToAndCall"
  | "initialize"
  | "getHighestBid"
  | "getNftOffer"
  | "getAddressesBids"
  | "getPrevious"
  | "makeOffer"
  | "acceptOffer"
  | "cancelOffer";
export interface AcceptOfferEventEmittedResponse {
  tokenId: BigNumberish;
  owner: string;
  bidder: string;
  bid: BigNumberish;
}
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
export interface NewOfferEventEmittedResponse {
  tokenId: BigNumberish;
  owner: string;
  bidder: string;
  bid: BigNumberish;
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface RemoveOfferEventEmittedResponse {
  tokenId: BigNumberish;
  bidder: string;
  bid: BigNumberish;
}
export interface UpgradedEventEmittedResponse {
  implementation: string;
}
export interface WithdrawEventEmittedResponse {
  tokenId: BigNumberish;
  bidder: string;
  bid: BigNumberish;
}
export interface OfferResponse {
  nftId: BigNumberish;
  0: BigNumberish;
  seller: string;
  1: string;
  highestBid: BigNumberish;
  2: BigNumberish;
  highestBidder: string;
  3: string;
}
export interface NftOffersContract {
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  collection(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  creator(overrides?: ContractCallOverrides): Promise<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  nftVendor(overrides?: ContractCallOverrides): Promise<string>;
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
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _collection Type: address, Indexed: false
   * @param _creator Type: address, Indexed: false
   * @param _nftVendor Type: address, Indexed: false
   * @param nftOffersStorageAddress Type: address, Indexed: false
   */
  initialize(
    _collection: string,
    _creator: string,
    _nftVendor: string,
    nftOffersStorageAddress: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _tokenId Type: uint256, Indexed: false
   */
  getHighestBid(
    _tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumberish>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _tokenId Type: uint256, Indexed: false
   */
  getNftOffer(
    _tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<OfferResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _tokenId Type: uint256, Indexed: false
   */
  getAddressesBids(
    _tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _tokenId Type: uint256, Indexed: false
   */
  getPrevious(
    _tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumberish>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param _tokenId Type: uint256, Indexed: false
   */
  makeOffer(
    _tokenId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param _tokenId Type: uint256, Indexed: false
   */
  acceptOffer(
    _tokenId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _tokenId Type: uint256, Indexed: false
   */
  cancelOffer(
    _tokenId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
}
