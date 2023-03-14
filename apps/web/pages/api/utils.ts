import axios from 'axios'

import { Web3Provider } from '@ethersproject/providers'

export const pinataApiKey = process.env.PINATA_API_KEY as string
export const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY as string

export const getSignedData = async (
  provider: Web3Provider | null,
  account: string
) => {
  const messageToSign = await axios.get(`/api/user/${account}/nonce`)

  const signer = provider!.getSigner()
  const signature = await signer.signMessage(JSON.parse(messageToSign.data))
  const address = await signer.getAddress()

  return {
    message: messageToSign.data,
    address,
    signature,
  }
}
