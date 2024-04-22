import axios from 'axios'

export const pinataApiKey = process.env.PINATA_API_KEY as string
export const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY as string

export const BASE_URL = 'https://us-central1-cask-chain.cloudfunctions.net'

export const getCustomToken = async (web3: any, address: string | null) => {
  if (!address) {
    throw new Error('Address is required')
  }

  const response = await axios.get(`${BASE_URL}/getMessage?address=${address}`)

  const messageToSign = response?.data?.messageToSign

  const signature = await web3.eth.personal.sign(messageToSign, address)

  const jwtResponse = await axios.get(
    `${BASE_URL}/getJWT?address=${address}&signature=${signature}`
  )

  const customToken = jwtResponse?.data?.customToken

  return customToken
}
