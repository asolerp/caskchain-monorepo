/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CryptoHookFactory } from '@_types/hooks'
import { Nft } from '@_types/nft'

import useLoading from '@hooks/common/useLoading'
import { useGlobal } from '@providers/global'
import axios from 'axios'
import axiosClient from 'lib/fetcher/axiosInstance'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import useSWR from 'swr'

type AllNftsHookFactory = CryptoHookFactory<Nft[], any>

export type UseAllNftsHook = ReturnType<any>

export const hookFactory: AllNftsHookFactory =
  ({}) =>
  () => {
    const [pageSize] = useState(10)
    const [page, setPage] = useState(1)

    const {
      state: { user },
    } = useGlobal()

    const {
      data,
      isLoading,
      isValidating,
      mutate: refetchData,
    } = useSWR(
      '/api/casks',
      async () => {
        const nfts: any = await axios.get(
          `/api/casks?page=${page}&pageSize=${pageSize}`
        )
        return nfts?.data || []
      },
      {
        revalidateOnMount: true,
      }
    )

    useLoading({ loading: isLoading })

    useEffect(() => {
      refetchData()
    }, [page])

    const handleAddFavorite = async (nftId: string) => {
      try {
        await axiosClient.post(`/api/casks/${nftId}/favorite`, {
          userId: user?._id,
        })
        refetchData()
      } catch (err: any) {
        toast.error(err?.response?.data?.message)
      }
    }

    return {
      page,
      setPage,
      pageSize,
      isLoading,
      isValidating,
      handleAddFavorite,
      data: data || [],
    }
  }
