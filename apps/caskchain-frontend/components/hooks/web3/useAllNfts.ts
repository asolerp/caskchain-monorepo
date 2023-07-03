/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CryptoHookFactory } from '@_types/hooks'
import { Nft, NftsPaginated } from '@_types/nft'
import { useAuth } from '@hooks/auth'
import useMarketPlaceFilters from '@hooks/common/useMarketPlaceFilters'
import { normalizeString } from 'caskchain-lib'
import { useGlobal } from '@providers/global'
import axios, { AxiosResponse } from 'axios'
import { LoadingContext } from 'components/contexts/LoadingContext'

import axiosClient from 'lib/fetcher/axiosInstance'
import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import groupByAndSum from './utils/groupAndSum'
import useSWR from 'swr'
import buildQueryString from './utils/buildQuery'

type AllNftsHookFactory = CryptoHookFactory<Nft[], any>

export type UseAllNftsHook = ReturnType<any>

export const hookFactory: AllNftsHookFactory =
  ({}) =>
  () => {
    const {
      state: { user },
    } = useGlobal()

    const { setIsLoading } = useContext(LoadingContext)
    const {
      activeSort,
      removeFilter,
      setActiveSort,
      sortDirection,
      selectedFilters,
      handleAddFilter,
      setSortDirection,
      mapSortDirection,
    } = useMarketPlaceFilters()

    const [pageSize, setPageSize] = useState(10)
    const [name, setName] = useState('')

    const [searchLoading, setSearchLoading] = useState(false)
    const [activeLiquor, setActiveLiquor] = useState<string[] | undefined>([])

    const [filterList, setFilterList] = useState<string[]>([])

    const { auth } = useAuth()

    const fetchNFTs = async (): Promise<NftsPaginated> => {
      const response: AxiosResponse = await axios.get(
        buildQueryString(
          1,
          pageSize,
          name,
          selectedFilters,
          activeSort,
          sortDirection
        )
      )
      return response.data
    }

    const fetchFilters = async (): Promise<any> => {
      const response: AxiosResponse = await axios.get('/api/stats/filters')
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

    const { data: filters } = useSWR('/api/stats/filters', fetchFilters, {
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
    }, [pageSize, activeLiquor, sortDirection, activeSort, selectedFilters])

    const handleSelectFilterOption = (filterType: string, value: string) => {
      handleAddFilter(filterType, value)
    }

    const handleSetFilterList = (filterType: string) => {
      if (!activeLiquor || activeLiquor.length === 0) {
        const selectedFilters = Object.entries(filters)
          .map(([key, _]) => {
            return filters[key][filterType]
          })
          .filter((filter: any) => filter !== undefined)

        const groupedFilters = groupByAndSum(selectedFilters)

        setFilterList(Object.keys(groupedFilters))
      } else {
        const selectedFilters = activeLiquor
          .map((liquor: string) => {
            return filters[liquor][filterType]
          })
          .filter((filter: any) => filter !== undefined)

        const groupedFilters = groupByAndSum(selectedFilters)

        setFilterList(
          Object.keys(groupedFilters).map((key) => normalizeString(key))
        )
      }
    }

    const handleSearch = async () => {
      refetchData()
    }

    const handleActiveLiquor = (liquor: string) => {
      if (activeLiquor?.includes(liquor)) {
        setActiveLiquor(activeLiquor?.filter((l) => l !== liquor))
      } else {
        setActiveLiquor([...(activeLiquor || []), liquor])
      }
      handleAddFilter('liquor', liquor)
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

    console.log('selected filters', selectedFilters)

    return {
      name,
      setName,
      isLoading,
      activeSort,
      filterList,
      isValidating,
      activeLiquor,
      removeFilter,
      handleSearch,
      setActiveSort,
      searchLoading,
      sortDirection,
      handleAddFilter,
      selectedFilters,
      data: data || [],
      fetchMoreBarrels,
      setSortDirection,
      mapSortDirection,
      handleAddFavorite,
      handleActiveLiquor,
      handleSetFilterList,
      handleSearchInputChange,
      handleSelectFilterOption,
    }
  }
