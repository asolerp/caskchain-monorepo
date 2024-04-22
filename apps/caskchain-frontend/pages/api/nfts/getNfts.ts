import axios from 'axios'
import { BASE_URL } from '../utils'

export const getNfts = async ({
  pageParam = null,
  filters = null,
  lastDocId,
}: any) => {
  const queryParams = new URLSearchParams({
    pageSize: pageParam,
  })

  if (Object.values(filters).filter((v) => !!v).length > 0) {
    queryParams.set('filters', JSON.stringify(filters))
  }

  if (lastDocId) {
    queryParams.set('lastDocId', lastDocId) // Añadir lastDocId de manera segura
  }
  return await axios.get(`${BASE_URL}/getNfts?${queryParams}`).then((res) => {
    return res.data
  })
}
