import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from 'ethers';
import { EthersContractContextV5 } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContextV5<
  NftVendorContract,
  NftVendorContractMethodNames,
  NftVendorContractEventsContext,
  NftVendorContractEvents
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
export type NftVendorContractEvents =
  | 'ItemBought'
  | 'ItemCanceled'
  | 'ItemListed';
export interface NftVendorContractEventsContext {
  ItemBought(...parameters: any): EventFilter;
  ItemCanceled(...parameters: any): EventFilter;
  ItemListed(...parameters: any): EventFilter;
}
export type NftVendorContractMethodNames =
  | 'new'
  | 'collection'
  | 'creator'
  | 'royaltyInfo'
  | 's_excludedList'
  | 'supportsInterface'
  | 'listItem'
  | 'cancelListing'
  | 'buyItem'
  | 'updateListing'
  | 'withdrawProceeds'
  | 'totalSupply'
  | 'tokenByIndex'
  | 'getListing'
  | 'getAllListedNftsId'
  | 'getAllListedNFTs'
  | 'getProceeds';
export interface ItemBoughtEventEmittedResponse {
  buyer: string;
  nftAddress: string;
  tokenId: BigNumberish;
  price: BigNumberish;
}
export interface ItemCanceledEventEmittedResponse {
  seller: string;
  nftAddress: string;
  tokenId: BigNumberish;
}
export interface ItemListedEventEmittedResponse {
  seller: string;
  nftAddress: string;
  tokenId: BigNumberish;
  price: BigNumberish;
}
export interface RoyaltyInfoResponse {
  result0: string;
  0: string;
  result1: BigNumber;
  1: BigNumber;
  length: 2;
}
export interface ListingResponse {
  tokenId: BigNumber;
  0: BigNumber;
  price: BigNumber;
  1: BigNumber;
  seller: string;
  2: string;
}
export interface NftVendorContract {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param _collection Type: address, Indexed: false
   * @param _creator Type: address, Indexed: false
   */
  'new'(
    _collection: string,
    _creator: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
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
   * @param _tokenId Type: uint256, Indexed: false
   * @param _salePrice Type: uint256, Indexed: false
   */
  royaltyInfo(
    _tokenId: BigNumberish,
    _salePrice: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<RoyaltyInfoResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   */
  s_excludedList(
    parameter0: string,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param interfaceId Type: bytes4, Indexed: false
   */
  supportsInterface(
    interfaceId: Arrayish,
    overrides?: ContractCallOverrides
  ): Promise<boolean>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param price Type: uint256, Indexed: false
   */
  listItem(
    tokenId: BigNumberish,
    price: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  cancelListing(
    tokenId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  buyItem(
    tokenId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param newPrice Type: uint256, Indexed: false
   */
  updateListing(
    tokenId: BigNumberish,
    newPrice: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  withdrawProceeds(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  totalSupply(overrides?: ContractCallOverrides): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param index Type: uint256, Indexed: false
   */
  tokenByIndex(
    index: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   */
  getListing(
    tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<ListingResponse>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAllListedNftsId(overrides?: ContractCallOverrides): Promise<BigNumber[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAllListedNFTs(
    overrides?: ContractCallOverrides
  ): Promise<ListingResponse[]>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param seller Type: address, Indexed: false
   */
  getProceeds(
    seller: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
}
