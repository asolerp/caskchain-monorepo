import { CryptoHookFactory } from '@_types/hooks'
import { useGlobal } from '@providers/global'

import axiosClient from 'lib/fetcher/axiosInstance'

import useSWR from 'swr'

type UseSideBarResponse = {
  // acceptOffer: (tokenId: number) => Promise<void>
  // listNft: (tokenId: number, price: number) => Promise<void>
}

type SideBarHookFactory = CryptoHookFactory<UseSideBarResponse>
export type UseSideBarHook = ReturnType<SideBarHookFactory>

export const hookFactory: SideBarHookFactory =
  ({}) =>
  () => {
    const {
      state: { sideBar },
    } = useGlobal()

    const {
      data,
      isLoading: isLoadingMe,
      isValidating: isValidatingMe,
    } = useSWR(
      sideBar ? '/api/casks/me' : null,
      async () => {
        const ownedNfts: any = await axiosClient.get('/api/casks/me')
        return ownedNfts.data
      },
      {
        revalidateOnFocus: false,
      }
    )

    return {
      data: data || [],
    }
  }
