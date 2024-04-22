import axios from 'axios'
import useSWR from 'swr'

const useBestBarrels = () => {
  const { data } = useSWR(
    'api/casks/bestBarrels',
    async () => {
      const { data: bestBarrels }: any = await axios.get(
        `/api/casks/bestBarrels`
      )

      return bestBarrels
    },
    { revalidateOnFocus: false }
  )

  return {
    bestBarrels: data,
  }
}

export default useBestBarrels
