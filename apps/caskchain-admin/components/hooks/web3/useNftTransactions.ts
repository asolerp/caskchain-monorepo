import { CryptoHookFactory } from '@_types/hooks'
import axiosClient from 'lib/fetcher/axiosInstance'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

type UseNftTransactionsResponse = {
  // acceptOffer: (tokenId: number) => Promise<void>
  // listNft: (tokenId: number, price: number) => Promise<void>
}

type NftTransactionsHookFactory = CryptoHookFactory<UseNftTransactionsResponse>
export type UseNftTransactionsHook = ReturnType<NftTransactionsHookFactory>

export const hookFactory: NftTransactionsHookFactory =
  ({}) =>
  () => {
    const [transactions, setTransactions] = useState<any[]>([])

    useEffect(() => {
      const fetchTransactions = async () => {
        const allTransactionsData: any = await axiosClient.get(
          `/api/transactions/all`
        )
        setTransactions(allTransactionsData.data)
      }
      fetchTransactions()
    }, [])

    const {
      data: allRoyalties,
      // isLoading: totalUsersLoading,
      // isValidating: totalUsersValidating,
      // mutate: totalUsersRefetch,
    } = useSWR(
      '/api/transactions/royalties',
      async () => {
        const allRoyaltiesData: any = await axiosClient.get(
          `/api/transactions/royalties`
        )

        return allRoyaltiesData.data
      },
      {
        revalidateOnFocus: false,
        revalidateOnMount: true,
      }
    )

    return {
      allRoyalties,
      allTransactions: transactions,
    }
  }
