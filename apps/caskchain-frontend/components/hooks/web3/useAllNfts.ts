/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CryptoHookFactory } from '@_types/hooks'
import { Nft, NftsPaginated } from '@_types/nft'
import { useAuth } from '@hooks/auth'

import { useGlobal } from '@providers/global'
import axios, { AxiosResponse } from 'axios'
import { LoadingContext } from 'components/contexts/LoadingContext'

import axiosClient from 'lib/fetcher/axiosInstance'
import { useContext, useEffect, useState } from 'react'
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

    const { setIsLoading } = useContext(LoadingContext)

    const [pageSize, setPageSize] = useState(10)
    const [name, setName] = useState('')
    const [searchLoading, setSearchLoading] = useState(false)
    const [activeFilter, setActiveFilter] = useState('')

    const { auth } = useAuth()

    const fetchNFTs = async (): Promise<NftsPaginated> => {
      const response: AxiosResponse = await axios.get(
        `/api/casks?page=1&pageSize=${pageSize}${
          activeFilter ? `&liquor=${activeFilter}` : ''
        }${name ? `&name=${name}` : ''}`
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

    const fetchMoreBarrels = async () => {
      if (pageSize < parseInt(data?.paging?.totalCount as string)) {
        setPageSize((prev) => prev + 1)
      }
    }

    useEffect(() => {
      if (isLoading) {
        return setIsLoading(true)
      }
      return setIsLoading(false)
    }, [isLoading])

    useEffect(() => {
      if (isValidating) {
        setSearchLoading(true)
        setTimeout(() => {
          setSearchLoading(false)
        }, 1000)
      }
    }, [isValidating])

    useEffect(() => {
      refetchData()
    }, [pageSize, activeFilter])

    const handleSearch = async () => {
      refetchData()
    }

    const handleActiveFilter = (liquor: string) => {
      if (activeFilter === liquor) {
        setActiveFilter('')
      } else {
        setActiveFilter(liquor)
      }
    }

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

    // Function to handle debouncing
    const debounce = (callback: any, delay: number) => {
      let timeoutId: NodeJS.Timeout
      return function (...args: any) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          // eslint-disable-next-line prefer-spread
          callback.apply(null, args)
        }, delay)
      }
    }

    // Debounced version of fetchSearchResults
    const debouncedFetchSearchResults = debounce(refetchData, 300)

    // Event handler for search input change
    const handleSearchInputChange = (event: any) => {
      const name = event.target.value
      setName(name)
      debouncedFetchSearchResults(name)
    }

    return {
      name,
      setName,
      isLoading,
      activeFilter,
      isValidating,
      handleSearch,
      searchLoading,
      data: data || [],
      fetchMoreBarrels,
      handleAddFavorite,
      handleActiveFilter,
      handleSearchInputChange,
    }
  }
