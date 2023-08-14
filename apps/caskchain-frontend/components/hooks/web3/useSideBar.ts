import { CryptoHookFactory } from '@_types/hooks'
import { useGlobal } from '@providers/global'
import { getWalletProvider } from 'caskchain-lib/lib/magic'

import axiosClient from 'lib/fetcher/axiosInstance'
import { magic } from 'lib/magic'
import { useEffect, useState } from 'react'

import useSWR from 'swr'

type UseSideBarResponse = {
  // acceptOffer: (tokenId: number) => Promise<void>
  // listNft: (tokenId: number, price: number) => Promise<void>
}

type SideBarHookFactory = CryptoHookFactory<UseSideBarResponse>
export type UseSideBarHook = ReturnType<SideBarHookFactory>

export const hookFactory: SideBarHookFactory =
  ({ web3 }) =>
  () => {
    const {
      state: { sideBar },
    } = useGlobal()

    const [isMagicWallet, setIsMagicWallet] = useState<string>('')

    useEffect(() => {
      const getWalletType = async () => {
        const isMagicWallet = await web3.currentProvider.isMagic
        setIsMagicWallet(isMagicWallet)
      }
      if (web3) {
        getWalletType()
      }
    }, [web3])

    const { data } = useSWR(
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
      isMagicWallet,
    }
  }
