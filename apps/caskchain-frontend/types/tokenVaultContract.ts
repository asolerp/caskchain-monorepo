import {
  ContractTransaction,
  BytesLike as Arrayish,
  BigNumberish,
} from 'ethers'
import { EthersContractContextV5 } from 'ethereum-abi-types-generator'

export type ContractContext = EthersContractContextV5<
  TokenVaultContract,
  TokenVaultContractMethodNames,
  TokenVaultContractEventsContext,
  TokenVaultContractEvents
>

export declare type EventFilter = {
  address?: string
  topics?: Array<string>
  fromBlock?: string | number
  toBlock?: string | number
}

export interface ContractTransactionOverrides {
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number
  /**
   * The price (in wei) per unit of gas
   */
  gasPrice?: BigInt | string | number | Promise<any>
  /**
   * The nonce to use in the transaction
   */
  nonce?: number
  /**
   * The amount to send with the transaction (i.e. msg.value)
   */
  value?: BigInt | string | number | Promise<any>
  /**
   * The chain ID (or network ID) to use
   */
  chainId?: number
}

export interface ContractCallOverrides {
  /**
   * The address to execute the call as
   */
  from?: string
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number
}
export type TokenVaultContractEvents =
  | 'Approval'
  | 'Bid'
  | 'Cash'
  | 'Initialized'
  | 'PriceUpdate'
  | 'Redeem'
  | 'Start'
  | 'Transfer'
  | 'Won'
export interface TokenVaultContractEventsContext {
  Approval(...parameters: any): EventFilter
  Bid(...parameters: any): EventFilter
  Cash(...parameters: any): EventFilter
  Initialized(...parameters: any): EventFilter
  PriceUpdate(...parameters: any): EventFilter
  Redeem(...parameters: any): EventFilter
  Start(...parameters: any): EventFilter
  Transfer(...parameters: any): EventFilter
  Won(...parameters: any): EventFilter
}
export type TokenVaultContractMethodNames =
  | 'new'
  | 'allowance'
  | 'approve'
  | 'balanceOf'
  | 'canRedeem'
  | 'decimals'
  | 'decreaseAllowance'
  | 'forSale'
  | 'id'
  | 'increaseAllowance'
  | 'name'
  | 'onERC721Received'
  | 'reserveTotal'
  | 'symbol'
  | 'token'
  | 'totalSupply'
  | 'transfer'
  | 'transferFrom'
  | 'userPrices'
  | 'votingTokens'
  | 'weth'
  | 'initialize'
  | 'reservePrice'
  | 'purchase'
  | 'redeem'
export interface ApprovalEventEmittedResponse {
  owner: string
  spender: string
  value: BigNumberish
}
export interface BidEventEmittedResponse {
  buyer: string
  price: BigNumberish
}
export interface CashEventEmittedResponse {
  owner: string
  shares: BigNumberish
}
export interface InitializedEventEmittedResponse {
  version: BigNumberish
}
export interface PriceUpdateEventEmittedResponse {
  user: string
  price: BigNumberish
}
export interface RedeemEventEmittedResponse {
  redeemer: string
}
export interface StartEventEmittedResponse {
  buyer: string
  price: BigNumberish
}
export interface TransferEventEmittedResponse {
  from: string
  to: string
  value: BigNumberish
}
export interface WonEventEmittedResponse {
  buyer: string
  price: BigNumberish
}
export interface TokenVaultContract {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   */
  'new'(overrides?: ContractTransactionOverrides): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param owner Type: address, Indexed: false
   * @param spender Type: address, Indexed: false
   */
  allowance(
    owner: string,
    spender: string,
    overrides?: ContractCallOverrides
  ): Promise<BigInt>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param spender Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  approve(
    spender: string,
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param account Type: address, Indexed: false
   */
  balanceOf(account: string, overrides?: ContractCallOverrides): Promise<BigInt>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  canRedeem(overrides?: ContractCallOverrides): Promise<boolean>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  decimals(overrides?: ContractCallOverrides): Promise<number>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param spender Type: address, Indexed: false
   * @param subtractedValue Type: uint256, Indexed: false
   */
  decreaseAllowance(
    spender: string,
    subtractedValue: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  forSale(overrides?: ContractCallOverrides): Promise<boolean>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  id(overrides?: ContractCallOverrides): Promise<BigInt>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param spender Type: address, Indexed: false
   * @param addedValue Type: uint256, Indexed: false
   */
  increaseAllowance(
    spender: string,
    addedValue: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  name(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   * @param parameter1 Type: address, Indexed: false
   * @param parameter2 Type: uint256, Indexed: false
   * @param parameter3 Type: bytes, Indexed: false
   */
  onERC721Received(
    parameter0: string,
    parameter1: string,
    parameter2: BigNumberish,
    parameter3: Arrayish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  reserveTotal(overrides?: ContractCallOverrides): Promise<BigInt>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  symbol(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  token(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  totalSupply(overrides?: ContractCallOverrides): Promise<BigInt>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param to Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  transfer(
    to: string,
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param from Type: address, Indexed: false
   * @param to Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  transferFrom(
    from: string,
    to: string,
    amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   */
  userPrices(
    parameter0: string,
    overrides?: ContractCallOverrides
  ): Promise<BigInt>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  votingTokens(overrides?: ContractCallOverrides): Promise<BigInt>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  weth(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _curator Type: address, Indexed: false
   * @param _token Type: address, Indexed: false
   * @param _id Type: uint256, Indexed: false
   * @param _supply Type: uint256, Indexed: false
   * @param _listPrice Type: uint256, Indexed: false
   * @param _name Type: string, Indexed: false
   * @param _symbol Type: string, Indexed: false
   */
  initialize(
    _curator: string,
    _token: string,
    _id: BigNumberish,
    _supply: BigNumberish,
    _listPrice: BigNumberish,
    _name: string,
    _symbol: string,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  reservePrice(overrides?: ContractCallOverrides): Promise<BigInt>
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   */
  purchase(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _amount Type: uint256, Indexed: false
   */
  redeem(
    _amount: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
}
