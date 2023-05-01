import { CryptoHookFactory } from '@_types/hooks'
import axiosClient from 'lib/fetcher/axiosInstance'
import useSWR from 'swr'

type UseStatsResponse = {
  sentOffers: any[]
  // makeOffer: (_tokenId: number, offer: string) => Promise<void>
}

type UseStatsHookFactory = CryptoHookFactory<UseStatsResponse>

export type UseStatsHook = ReturnType<UseStatsHookFactory>

export const hookFactory: UseStatsHookFactory =
  ({ ccNft }) =>
  () => {
    const {
      data: totalUsers,
      // isLoading: totalUsersLoading,
      // isValidating: totalUsersValidating,
      // mutate: totalUsersRefetch,
    } = useSWR(
      '/api/stats/total-users',
      async () => {
        const totalStatsData: any = await axiosClient.get(
          `/api/stats/total-users`
        )

        console.log('Stats', totalStatsData)

        return totalStatsData.data.total
      },
      {
        revalidateOnFocus: false,
        revalidateOnMount: true,
      }
    )

    const {
      data: totalNfts,
      // isLoading: totalUsersLoading,
      // isValidating: totalUsersValidating,
      // mutate: totalUsersRefetch,
    } = useSWR(
      ccNft ? 'web3/useStats' : null,
      async () => {
        const totalSupply: any = await ccNft!.getNftTotalSupply()
        return totalSupply?.toString()
      },
      {
        revalidateOnFocus: false,
        revalidateOnMount: true,
      }
    )

    return {
      totalNfts,
      totalUsers,
    }
  }
