import { useQuery } from '@tanstack/react-query'
import { getBestBarrels } from 'pages/api/nfts/getBestBarrels'

const useBestBarrels = () => {
  const { data } = useQuery({
    queryKey: ['getBestBarrels'],
    queryFn: async () => getBestBarrels(),
  })

  return {
    bestBarrels: data?.result || [],
  }
}

export default useBestBarrels
