import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from 'ethers';
import { EthersContractContextV5 } from 'ethereum-abi-types-generator';

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
export type NftOffersContractEvents =
  | 'Bid'
  | 'End'
  | 'OwnershipTransferred'
  | 'Start'
  | 'Withdraw';
export interface NftOffersContractEventsContext {
  Bid(...parameters: any): EventFilter;
  End(...parameters: any): EventFilter;
  OwnershipTransferred(...parameters: any): EventFilter;
  Start(...parameters: any): EventFilter;
  Withdraw(...parameters: any): EventFilter;
}
export type NftOffersContractMethodNames =
  | 'new'
  | 'bids'
  | 'nonFungibleContract'
  | 'owner'
  | 'renounceOwnership'
  | 'transferOwnership'
  | 'createNftOffer'
  | 'acceptOffer'
  | 'getBidAddressesByTokenId'
  | 'makeOffer'
  | 'withdraw'
  | 'getNftOffer'
  | '_removeOffer';
export interface BidEventEmittedResponse {
  sender: string;
  amount: BigNumberish;
}
export interface EndEventEmittedResponse {
  highestBidder: string;
  highestBid: BigNumberish;
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string;
  newOwner: string;
}
export interface WithdrawEventEmittedResponse {
  bidder: string;
  amount: BigNumberish;
}
export interface OfferResponse {
  nftId: BigNumber;
  0: BigNumber;
  seller: string;
  1: string;
  lowerBid: BigNumber;
  2: BigNumber;
  highestBid: BigNumber;
  3: BigNumber;
  highestBidder: string;
  4: string;
}
export interface NftOffersContract {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param _nonFungibleContract Type: address, Indexed: false
   */
  'new'(
    _nonFungibleContract: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   */
  bids(
    parameter0: string,
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  nonFungibleContract(overrides?: ContractCallOverrides): Promise<string>;
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
   * @param _tokenId Type: uint256, Indexed: false
   * @param _nftPrice Type: uint256, Indexed: false
   * @param _seller Type: address, Indexed: false
   */
  createNftOffer(
    _tokenId: BigNumberish,
    _nftPrice: BigNumberish,
    _seller: string,
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
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param _tokenId Type: uint256, Indexed: false
   */
  getBidAddressesByTokenId(
    _tokenId: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string[]>;
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
  withdraw(
    _tokenId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
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
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _tokenId Type: uint256, Indexed: false
   */
  _removeOffer(
    _tokenId: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
}
