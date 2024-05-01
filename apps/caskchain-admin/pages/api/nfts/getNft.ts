import axios from 'axios'
import { BASE_URL } from '../utils'

export const getNft = async ({ tokenId }: any) => {
  return await axios
    .get(`${BASE_URL}/getNft?tokenId=${tokenId}`)
    .then((res) => {
      return res.data
    })
}
