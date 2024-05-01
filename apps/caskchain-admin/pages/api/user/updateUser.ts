import axios from 'axios'
import { BASE_URL } from '../utils'

export const updateUser = async (
  uid: string | undefined,
  data: any
): Promise<void> => {
  if (!uid) {
    throw new Error('Address is required')
  }

  await axios.post(`${BASE_URL}/updateUser?uid=${uid}`, {
    ...data,
  })
}
