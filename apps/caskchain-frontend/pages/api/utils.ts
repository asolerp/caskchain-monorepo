import axios from 'axios'

export const pinataApiKey = process.env.PINATA_API_KEY as string
export const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY as string

export const getSignedData = async (web3: any, account: any) => {
  const messageToSign = await axios.get(`/api/user/${account}/nonce`)

  const signature = await web3.eth.personal.sign(
    JSON.parse(messageToSign.data),
    account
  )

  return {
    message: messageToSign.data,
    signature,
  }
}
