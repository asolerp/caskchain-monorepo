import { ethers } from 'ethers'
import Web3 from 'web3'
import { CreateTransactionUseCase } from '../../domain/interfaces/use-cases/create-transaction-use-case'

// const infuraWS = 'wss://goerli.infura.io/ws/v3/1dcf28e0a45a43d3aab3124c1a23f817'

const web3 = new Web3(
  new Web3.providers.WebsocketProvider('ws://127.0.0.1:8545')
)

// interface WebSocketProps {
//     createTransactionRegistry: CreateTransaction
// }

export const initiWebSocket = (
  createTransactionUseCase: CreateTransactionUseCase
) => {
  const options721 = {
    topics: [
      web3.utils.sha3('Transfer(address,address,uint256)'),
      web3.utils.sha3('Sale(address,address,uint256,uint256)'),
    ],
  }

  const subscription721 = web3.eth.subscribe('logs', options721)

  subscription721.on('data', async (event) => {
    const transaction = web3.eth.abi.decodeLog(
      [
        {
          type: 'address',
          name: 'from',
          indexed: true,
        },
        {
          type: 'address',
          name: 'to',
          indexed: true,
        },
        {
          type: 'uint256',
          name: 'tokenId',
        },
        {
          type: 'uint256',
          name: 'value',
        },
      ],
      event.data,
      [event.topics[1], event.topics[2]]
    )

    if (event.address == process.env.NFT_CONTRACT_ADDRESS) {
      await createTransactionUseCase.execute(transaction.tokenId, {
        from: transaction.from,
        to: transaction.to,
        date: new Date(),
        tokenId: transaction.tokenId,
        value: transaction.value,
        type: '',
      })

      console.log(
        `\n` +
          `New ERC-712 transaction found in block ${event.blockNumber} with hash ${event.transactionHash}\n` +
          `From: ${
            transaction.from === '0x0000000000000000000000000000000000000000'
              ? 'New mint!'
              : transaction.from
          }\n` +
          `To: ${transaction.to}\n` +
          `Token contract: ${event.address}\n` +
          `Token ID: ${transaction.tokenId}\n` +
          `Price: ${ethers.utils.formatEther(transaction.value)}`
      )
    }
  })
}
