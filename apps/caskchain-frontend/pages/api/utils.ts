import axios from 'axios'

import { FetchSignerResult } from '@wagmi/core'

export const pinataApiKey = process.env.PINATA_API_KEY as string
export const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY as string

export const getSignedData = async (
  signer: FetchSignerResult<any>,
  account: string
) => {
  const messageToSign = await axios.get(`/api/user/${account}/nonce`)

  const signature = await signer!.signMessage(JSON.parse(messageToSign.data))
  const address = await signer!.getAddress()

  return {
    message: messageToSign.data,
    address,
    signature,
  }
}
