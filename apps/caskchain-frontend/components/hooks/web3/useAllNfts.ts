/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CryptoHookFactory } from '@_types/hooks'
import { Nft } from '@_types/nft'
import { useAuth } from '@hooks/auth'
import useLoading from '@hooks/common/useLoading'
import { useGlobal } from '@providers/global'
import axios from 'axios'
import axiosClient from 'lib/fetcher/axiosInstance'
import { toast } from 'react-toastify'

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
    const {
      state: { user },
    } = useGlobal()
    const { auth } = useAuth()
    const { data, isLoading, isValidating } = useSWR(
      'web3/useAllNfts',
      async () => {
        const nfts: any = await axios.get('/api/casks')
        return nfts?.data || []
      }
    )

    useLoading({ loading: isLoading || isValidating })

    const handleAddFavorite = async (nftId: string) => {
      try {
        await axiosClient.post(`/api/casks/${nftId}/favorite`, {
          userId: user?._id,
        })
        auth.refetchUser()
      } catch (err: any) {
        toast.error(err?.response?.data?.message)
      }
    }

    return {
      isLoading,
      isValidating,
      handleAddFavorite,
      data: data || [],
    }
  }
