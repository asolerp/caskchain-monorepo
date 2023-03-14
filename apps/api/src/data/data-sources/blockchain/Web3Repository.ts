import { Contract } from 'ethers'
import Web3 from 'web3'

export abstract class Web3Repository {
  constructor(
    private _client: Web3,
    private _wsClient: Web3,
    private _contracts: Contract[]
  ) {}

  protected client(): Web3 {
    return this._client
  }

  protected wsClient(): Web3 {
    return this._wsClient
  }

  protected contracts(): any {
    return this._contracts
  }
}
