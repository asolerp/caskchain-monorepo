/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios'

import useSWR from 'swr'

export const useFractionalizedNfts = () => {
  const { data, ...swr } = useSWR('web3/useFractionalizedNfts', async () => {
    const { data: nfts }: any = await axios.get('/api/casks')
    return nfts.filter((nft: any) => nft?.fractions?.unitPrice > 0)
  })

  return {
    ...swr,
    data: data,
  }
}
