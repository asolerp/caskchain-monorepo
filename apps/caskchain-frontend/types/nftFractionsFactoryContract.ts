import {
  ContractTransaction,
  BytesLike as Arrayish,
  BigNumberish,
} from 'ethers'
import { EthersContractContextV5 } from 'ethereum-abi-types-generator'

export type ContractContext = EthersContractContextV5<
  NftFractionsFactoryContract,
  NftFractionsFactoryContractMethodNames,
  NftFractionsFactoryContractEventsContext,
  NftFractionsFactoryContractEvents
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
export type NftFractionsFactoryContractEvents =
  | 'Mint'
  | 'OwnershipTransferred'
  | 'Paused'
  | 'Unpaused'
export interface NftFractionsFactoryContractEventsContext {
  Mint(...parameters: any): EventFilter
  OwnershipTransferred(...parameters: any): EventFilter
  Paused(...parameters: any): EventFilter
  Unpaused(...parameters: any): EventFilter
}
export type NftFractionsFactoryContractMethodNames =
  | 'new'
  | 'logic'
  | 'owner'
  | 'paused'
  | 'renounceOwnership'
  | 'transferOwnership'
  | 'vaultByTokenId'
  | 'vaultCount'
  | 'vaults'
  | 'mint'
  | 'getVaultContractByTokenId'
  | 'getVaultContract'
  | 'pause'
  | 'unpause'
export interface MintEventEmittedResponse {
  token: string
  id: BigNumberish
  price: BigNumberish
  vault: string
  vaultId: BigNumberish
}
export interface OwnershipTransferredEventEmittedResponse {
  previousOwner: string
  newOwner: string
}
export interface PausedEventEmittedResponse {
  account: string
}
export interface UnpausedEventEmittedResponse {
  account: string
}
export interface NftFractionsFactoryContract {
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
   */
  logic(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  owner(overrides?: ContractCallOverrides): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  paused(overrides?: ContractCallOverrides): Promise<boolean>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  renounceOwnership(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
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
  ): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: uint256, Indexed: false
   */
  vaultByTokenId(
    parameter0: BigNumberish,
    overrides?: ContractCallOverrides
  ): Promise<string>
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  vaultCount(overrides?: ContractCallOverrides): Promise<BigInt>
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
  ): Promise<string>
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
   * @param _listPrice Type: uint256, Indexed: false
   */
  mint(
    _name: string,
    _symbol: string,
    _token: string,
    _id: BigNumberish,
    _supply: BigNumberish,
    _listPrice: BigNumberish,
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
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
  ): Promise<string>
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
  ): Promise<string>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  pause(overrides?: ContractTransactionOverrides): Promise<ContractTransaction>
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  unpause(
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>
}
