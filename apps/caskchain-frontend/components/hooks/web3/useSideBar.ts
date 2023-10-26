import { CryptoHookFactory } from '@_types/hooks'
import { useGlobal } from '@providers/global'
import { deleteCookie } from 'cookies-next'
import axiosClient from 'lib/fetcher/axiosInstance'

import { useRouter } from 'next/router'
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

    const router = useRouter()

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
        try {
          const ownedNfts: any = await axiosClient.get('/api/casks/me')
          return ownedNfts.data
        } catch (err: any) {
          if (err.response.status === 401 || err.response.status === 403) {
            deleteCookie('token')
            router.reload()
          }
        }
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
