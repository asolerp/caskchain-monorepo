import axios from 'axios'
import { BASE_URL } from '../utils'

export const getUserData = async (uid: string | undefined) => {
  if (!uid) {
    return null
  }

  const response = await axios.get(`${BASE_URL}/getUserData?uid=${uid}`)

  const userData = response?.data

  return userData
}
