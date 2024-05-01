/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import useMarketPlaceFilters from '@hooks/common/useMarketPlaceFilters'

import { useGlobal } from '@providers/global'

import { useInfiniteQuery } from '@tanstack/react-query'

import axiosClient from 'lib/fetcher/axiosInstance'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { GlobalTypes } from '@providers/global/utils'
import { getNfts } from 'pages/api/nfts/getNfts'
import { useAuth } from './useAuth'

export const useAllNfts = () => {
  const {
    state: { user },
    dispatch,
  } = useGlobal()

  const {
    activeSort,
    removeFilter,
    mapSortActive,
    setActiveSort,
    sortDirection,
    selectedFilters,
    handleAddFilter,
    setSortDirection,
    mapSortDirection,
  } = useMarketPlaceFilters()

  const { refetchUser } = useAuth()
  const [name, setName] = useState('')
  const [filters, setFilters] = useState<any>({ active: true })
  const [lastDocId, setLastDocId] = useState<any>(undefined)
  const [activeLiquor, setActiveLiquor] = useState<string[] | undefined>([])

  const {
    status,
    refetch,
    isSuccess,
    data: casks,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['getCasks', filters, activeSort],
    queryFn: ({ pageParam }) =>
      getNfts({
        pageParam,
        filters,
        orderBy: activeSort,
        limit: 20,
      }),
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage: any) => {
      return lastPage?.nextCursor
    },
  })

  useEffect(() => {
    setLastDocId(null)
  }, [filters, activeSort, sortDirection, refetch])

  useEffect(() => {
    if (lastDocId === null) {
      refetch()
    }
  }, [lastDocId, refetch])

  useEffect(() => {
    if (isSuccess && casks?.pages.length > 0) {
      const pages = casks.pages
      const lastPage = pages[pages.length - 1]
      const lastItem = lastPage.items?.[lastPage.items.length - 1]
      if (lastItem) {
        setLastDocId(lastItem.id)
      } else {
        setLastDocId(null)
      }
    }
  }, [isSuccess, casks])

  const handleChange = (e: any) => {
    setName(e.target.value)
  }

  const handlePressSearch = () => {
    setFilters({ ...filters, name })
  }

  const handleSelectFilterOption = (filterType: string, value: string) => {
    handleAddFilter(filterType, value)
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
      refetchUser({
        callback: (userFetched: any) =>
          dispatch({
            type: GlobalTypes.SET_USER,
            payload: { user: userFetched },
          }),
      })
    } catch (err: any) {
      toast.error(err?.response?.data?.message)
    }
  }

  const handleSearchInputChange = (event: any) => {
    const name = event.target.value
    setName(name)
  }

  return {
    name,
    refetch,
    setName,
    hasNextPage,
    activeSort,
    activeLiquor,
    removeFilter,
    handleChange,
    mapSortActive,
    fetchNextPage,
    setActiveSort,
    sortDirection,
    handleAddFilter,
    selectedFilters,
    data: casks || [],
    setSortDirection,
    mapSortDirection,
    handlePressSearch,
    handleAddFavorite,
    handleActiveLiquor,
    isValidating: false,
    handleSearchInputChange,
    handleSelectFilterOption,
    isLoading: status === 'pending' || isFetchingNextPage,
  }
}
