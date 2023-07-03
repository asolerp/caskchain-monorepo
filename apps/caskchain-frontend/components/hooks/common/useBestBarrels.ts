import axios from 'axios'
import useSWR from 'swr'

const useBestBarrels = () => {
  const { data } = useSWR(
    'api/casks/bestBarrels',
    async () => {
      const { data: bestBarrels }: any = await axios.get(
        `/api/casks/bestBarrels`
      )
      console.log('bestBarrels', bestBarrels)
      return bestBarrels
    },
    { revalidateOnFocus: true }
  )

  console.log('useBestBarrels', data)

  return {
    bestBarrels: data,
  }
}

export default useBestBarrels
