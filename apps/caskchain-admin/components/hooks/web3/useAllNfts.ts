/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */

import useLoading from '@hooks/common/useLoading'
// import { useGlobal } from '@providers/global'
// import axios from 'axios'
// import axiosClient from 'lib/fetcher/axiosInstance'
import { getNfts } from 'pages/api/nfts/getNfts'
import { useEffect, useState } from 'react'
// import { toast } from 'react-toastify'

import { useInfiniteQuery } from '@tanstack/react-query'

export const useAllNfts = () => {
  const [pageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [lastDocId, setLastDocId] = useState(null)

  const {
    // status,
    // refetch,
    isLoading,
    isSuccess,
    isPending,
    data: casks,
    // hasNextPage,
    // fetchNextPage,
    // isFetchingNextPage,
  } = useInfiniteQuery({
    initialPageParam: 10,
    queryKey: ['getCasks'],
    queryFn: ({ pageParam }) =>
      getNfts({ pageParam, filters: null, lastDocId, sortBy: 'tokenId' }),
    refetchOnWindowFocus: true,
    getNextPageParam: (lastPage: any) => {
      return lastPage?.nextPageToken
    },
  })

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

  useLoading({ loading: isLoading })

  return {
    page,
    setPage,
    pageSize,
    isLoading,
    isValidating: isPending,
    data: casks || [],
  }
}
