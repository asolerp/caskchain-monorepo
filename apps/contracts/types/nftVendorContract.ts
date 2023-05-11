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
  | 'AdminChanged'
  | 'BeaconUpgraded'
  | 'Initialized'
  | 'ItemBought'
  | 'ItemCanceled'
  | 'ItemListed'
  | 'OwnershipTransferred'
  | 'TxFeePaid'
  | 'Upgraded';
export interface NftVendorContractEventsContext {
  AdminChanged(...parameters: any): EventFilter;
  BeaconUpgraded(...parameters: any): EventFilter;
  Initialized(...parameters: any): EventFilter;
  ItemBought(...parameters: any): EventFilter;
  ItemCanceled(...parameters: any): EventFilter;
  ItemListed(...parameters: any): EventFilter;
  OwnershipTransferred(...parameters: any): EventFilter;
  TxFeePaid(...parameters: any): EventFilter;
  Upgraded(...parameters: any): EventFilter;
}
export type NftVendorContractMethodNames =
  | 'owner'
  | 'proxiableUUID'
  | 'renounceOwnership'
  | 'royaltyInfo'
  | 'supportsInterface'
  | 'transferOwnership'
  | 'upgradeTo'
  | 'upgradeToAndCall'
  | 'initialize'
  | 'emitTxFee'
  | 'listItem'
  | 'cancelListing'
  | 'buyItem'
  | 'buyNFTWithERC20'
  | 'updateListingPrice'
  | 'withdrawERC20'
  | 'withdrawProceeds'
  | 'totalSupply'
  | 'tokenByIndex'
  | 'getPriceByToken'
  | 'getAcceptedERC20tokens'
  | 'getListing'
  | 'getAllListedNftsId'
  | 'getAllListedNFTs'
  | 'getRoyalty'
  | 'getProceeds'
  | 'getIsExcluded'
  | 'addERC20Token'
  | 'removeERC20Token'
  | 'updateERC20TokenPrice'
  | 'calculateRoyaltyForAcceptedOffer'
  | '_payTxFee';
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
export interface ItemBoughtEventEmittedResponse {
  to: string;
  from: string;
  tokenId: BigNumberish;
  price: BigNumberish;
}
export interface ItemCanceledEventEmittedResponse {
  from: string;
  nftAddress: string;
  tokenId: BigNumberish;
}
export interface ItemListedEventEmittedResponse {
  from: string;
  nftAddress: string;
  tokenId: BigNumberish;
  price: BigNumberish;
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface TxFeePaidEventEmittedResponse {
  tokenId: BigNumberish;
  royalty: BigNumberish;
}
export interface UpgradedEventEmittedResponse {
  implementation: string;
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
   */
  initialize(
    _collection: string,
    _creator: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param royaltyAmount Type: uint256, Indexed: false
   */
  emitTxFee(
    tokenId: BigNumberish,
    royaltyAmount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
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
   * @param erc20Token Type: address, Indexed: false
   */
  buyNFTWithERC20(
    tokenId: BigNumberish,
    erc20Token: string,
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
  updateListingPrice(
    tokenId: BigNumberish,
    newPrice: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param erc20Token Type: address, Indexed: false
   */
  withdrawERC20(
    erc20Token: string,
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
   * @param tokenAddress Type: address, Indexed: false
   * @param tokenId Type: uint256, Indexed: false
   */
  getPriceByToken(
    tokenAddress: string,
    tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getAcceptedERC20tokens(overrides?: ContractCallOverrides): Promise<string[]>;
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
   * @param _tokenId Type: uint256, Indexed: false
   */
  getRoyalty(
    _tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
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
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  getIsExcluded(overrides?: ContractCallOverrides): Promise<boolean>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param erc20Token Type: address, Indexed: false
   */
  addERC20Token(
    erc20Token: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param erc20Token Type: address, Indexed: false
   */
  removeERC20Token(
    erc20Token: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param erc20Token Type: address, Indexed: false
   * @param price Type: uint256, Indexed: false
   */
  updateERC20TokenPrice(
    tokenId: BigNumberish,
    erc20Token: string,
    price: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _tokenId Type: uint256, Indexed: false
   * @param _highestBid Type: uint256, Indexed: false
   */
  calculateRoyaltyForAcceptedOffer(
    _tokenId: BigNumberish,
    _highestBid: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param tokenId Type: uint256, Indexed: false
   * @param royalty Type: uint256, Indexed: false
   */
  _payTxFee(
    tokenId: BigNumberish,
    royalty: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
}
