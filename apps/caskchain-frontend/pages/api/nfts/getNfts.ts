import axios from 'axios'
import { BASE_URL } from '../utils'

export const getNfts = async ({
  pageParam = null,
  filters = null,
  orderBy = 'tokenId',
  limit = 10,
}: any) => {
  console.log('PAGE PARAMS: ', pageParam)

  const queryParams = new URLSearchParams({
    startAfter: pageParam,
    limit,
    orderBy,
  })

  if (Object.values(filters).filter((v) => !!v).length > 0) {
    queryParams.set('filters', JSON.stringify(filters))
  }

  return await axios.get(`${BASE_URL}/getNfts?${queryParams}`).then((res) => {
    return res.data
  })
}
