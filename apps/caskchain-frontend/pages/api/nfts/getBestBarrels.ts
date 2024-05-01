import axios from 'axios'
import { BASE_URL } from '../utils'

export const getBestBarrels = async () => {
  return await axios.get(`${BASE_URL}/getBestBarrels`).then((res) => {
    return res.data
  })
}
