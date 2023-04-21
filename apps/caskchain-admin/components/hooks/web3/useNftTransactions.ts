import { CryptoHookFactory } from '@_types/hooks'
import axiosClient from 'lib/fetcher/axiosInstance'
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
    const {
      data: allTransactions,
      // isLoading: totalUsersLoading,
      // isValidating: totalUsersValidating,
      // mutate: totalUsersRefetch,
    } = useSWR(
      '/api/transactions/all',
      async () => {
        const allTransactionsData: any = await axiosClient.get(
          `/api/transactions/all`
        )

        return allTransactionsData.data
      },
      {
        revalidateOnFocus: false,
        revalidateOnMount: true,
      }
    )

    return {
      allTransactions,
    }
  }
