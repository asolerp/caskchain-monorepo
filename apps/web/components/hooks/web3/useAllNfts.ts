/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CryptoHookFactory } from '@_types/hooks'
import { Nft } from '@_types/nft'
import axios from 'axios'

import useSWR from 'swr'

type UseAllNftsResponse = {
  // withdraw: (tokenId: number) => Promise<void>
  // makeOffer: (tokenId: number, offer: string) => Promise<void>
  // buyShares: (tokenId: number, shares: number) => Promise<void>
}

type AllNftsHookFactory = CryptoHookFactory<Nft[], UseAllNftsResponse>

export type UseAllNftsHook = ReturnType<AllNftsHookFactory>

export const hookFactory: AllNftsHookFactory =
  ({}) =>
  () => {
    const { data, ...swr } = useSWR('web3/useAllNfts', async () => {
      const nfts: any = await axios.get('/api/casks')
      return nfts.data
    })

    return {
      ...swr,
      data: data || [],
    }
  }
