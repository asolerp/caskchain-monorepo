/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CryptoHookFactory } from '@_types/hooks'
import { Nft, NftsPaginated } from '@_types/nft'
import { useAuth } from '@hooks/auth'
import useLoading from '@hooks/common/useLoading'
import { useGlobal } from '@providers/global'
import axios, { AxiosResponse } from 'axios'
import axiosClient from 'lib/fetcher/axiosInstance'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import useSWR from 'swr'

type AllNftsHookFactory = CryptoHookFactory<Nft[], any>

export type UseAllNftsHook = ReturnType<any>

export const hookFactory: AllNftsHookFactory =
  ({}) =>
  () => {
    const {
      state: { user },
    } = useGlobal()

    const [pageSize, setPageSize] = useState(10)
    const { auth } = useAuth()

    const fetchNFTs = async (): Promise<NftsPaginated> => {
      const response: AxiosResponse = await axios.get(
        `/api/casks?page=1&pageSize=${pageSize}`
      )
      return response.data
    }

    const {
      data,
      isLoading,
      isValidating,
      mutate: refetchData,
    } = useSWR('web3/useAllNfts', fetchNFTs, {
      revalidateOnFocus: false,
    })

    useLoading({ loading: isLoading })

    const fetchMoreBarrels = async () => {
      if (pageSize < parseInt(data?.totalItems as string)) {
        setPageSize((prev) => prev + 1)
      }
    }

    useEffect(() => {
      refetchData()
    }, [pageSize])

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
      fetchMoreBarrels,
      handleAddFavorite,
      data: data || [],
    }
  }
