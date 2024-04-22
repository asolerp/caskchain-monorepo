import axios from 'axios'
import { BASE_URL } from '../utils'

export const getOwnedNfts = async ({ currentUser }: any) => {
  const idToken = await currentUser.getIdToken()

  console.log('idToken', idToken)

  const config = {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  }

  return await axios.get(`${BASE_URL}/getOwnedNfts`, config).then((res) => {
    return res.data
  })
}
