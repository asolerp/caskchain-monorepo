import * as dotenv from 'dotenv'
dotenv.config()

import { Contract } from 'ethers'
import Web3 from 'web3'
const { MNEMONIC } = process.env

console.log("MNEMONIC", MNEMONIC)

// eslint-disable-next-line @typescript-eslint/no-var-requires
const HDWalletProvider = require('@truffle/hdwallet-provider')

type Web3Contract = {
  contractName: string
  contractAddress: string
  contractABI: any
}

export class Web3ClientFactory {
  private static clients: { [key: string]: Web3 } = {}
  private static wsClients: { [key: string]: Web3 } = {}
  private static contracts: { [key: string]: any } = {}

  static createClient(
    contextName: string,
    url: any,
    ws: string,
    contractsData: Web3Contract[] & any
  ): any {
    let client = Web3ClientFactory.getClient(contextName)
    let wsClient = Web3ClientFactory.getWsClient(contextName)

    try {
      if (!wsClient) {
        wsClient = Web3ClientFactory.createWebsocketProvider(ws)
        Web3ClientFactory.registerWsClient(wsClient, contextName)
      }

      if (!client) {
        client = Web3ClientFactory.createAndConnectClient(url)
        Web3ClientFactory.registerClient(client, contextName)

        contractsData.forEach((contract: any) => {
          Web3ClientFactory.createContract(contextName, contract)
        })
      }
    } catch (e: any) {
      console.error('Error', e)
    }

    return {
      client,
      wsClient,
    }
  }

  static createContract(contextName: string, contractData: Web3Contract): void {
    const contract = Web3ClientFactory.getContract(contractData?.contractName)
    if (!contract) {
      Web3ClientFactory.setContract(
        contextName,
        contractData.contractName,
        contractData.contractAddress,
        contractData.contractABI
      )
    }
  }

  private static getClient(contextName: string): Web3 {
    return Web3ClientFactory.clients[contextName]
  }

  private static getWsClient(contextName: string): Web3 {
    return Web3ClientFactory.wsClients[contextName]
  }

  private static setContract(
    contextName: string,
    contractName: string,
    contractAddress: string,
    contractABI: any
  ) {
    Web3ClientFactory.contracts[contractName] = new Web3ClientFactory.clients[
      contextName
    ].eth.Contract(contractABI, contractAddress)
  }

  static getContract(contractName: string): Contract {
    return Web3ClientFactory.contracts?.[contractName]
  }

  static getContracts(): any {
    return Web3ClientFactory.contracts
  }

  private static createWebsocketProvider(ws: any): Web3 {
    const client = new Web3(ws)
    return client
  }

  private static createAndConnectClient(url: any): Web3 {
    const client = new Web3(new HDWalletProvider(MNEMONIC, url, 0, 5))
    return client
  }

  private static registerClient(client: Web3, contextName: string): void {
    Web3ClientFactory.clients[contextName] = client
  }

  private static registerWsClient(client: Web3, contextName: string): void {
    Web3ClientFactory.wsClients[contextName] = client
  }
}
