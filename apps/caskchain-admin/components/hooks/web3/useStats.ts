import { CryptoHookFactory } from '@_types/hooks'
import { useGlobal } from '@providers/global'
import { ethers } from 'ethers'
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
      state: { address },
    } = useGlobal()

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

    const {
      data: allTransactions,
      // isLoading: totalUsersLoading,
      // isValidating: totalUsersValidating,
      // mutate: totalUsersRefetch,
    } = useSWR(
      address ? 'incomeItemBought' : null,
      async () => {
        const allTransactionsData: any = await axiosClient.get(
          `/api/transactions/all?type=item-bought`
        )

        return allTransactionsData.data
      },
      {
        revalidateOnFocus: false,
        revalidateOnMount: true,
      }
    )

    const allOwnerTransactions = allTransactions?.filter(
      (t: any) => t.from.toLowerCase() === address?.toLowerCase()
    )

    const incomeMatic = allOwnerTransactions?.reduce(
      (acc: number, curr: any) => {
        if (!curr.isERC20) {
          return acc + Number(curr.value)
        }
        return acc
      },
      0
    )

    const incomeUSDT = allOwnerTransactions?.reduce(
      (acc: number, curr: any) => {
        if (curr.isERC20) {
          return acc + Number(curr.value)
        }
        return acc
      },
      0
    )

    return {
      totalNfts,
      totalUsers,
      incomeMatic:
        incomeMatic && ethers.utils.formatEther(BigInt(incomeMatic).toString()),
      incomeUSDT:
        incomeUSDT && ethers.utils.formatEther(BigInt(incomeUSDT).toString()),
    }
  }
