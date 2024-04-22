import { useWeb3 } from 'caskchain-lib/provider/web3'
// import { useGlobal } from '@providers/global'
// import { deleteCookie } from 'cookies-next'
// import axiosClient from 'lib/fetcher/axiosInstance'

// import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

// import useSWR from 'swr'

export const useSideBar = () => {
  const [isMagicWallet, setIsMagicWallet] = useState<string>('')
  const { web3 } = useWeb3()

  useEffect(() => {
    const getWalletType = async () => {
      const isMagicWallet = await web3.currentProvider.isMagic
      setIsMagicWallet(isMagicWallet)
    }
    if (web3) {
      getWalletType()
    }
  }, [web3])

  // const { data } = useSWR(
  //   sideBar ? '/api/casks/me' : null,
  //   async () => {
  //     try {
  //       const ownedNfts: any = await axiosClient.get('/api/casks/me')
  //       return ownedNfts.data
  //     } catch (err: any) {
  //       if (err.response.status === 401 || err.response.status === 403) {
  //         deleteCookie('token')
  //         router.reload()
  //       }
  //     }
  //   },
  //   {
  //     revalidateOnFocus: false,
  //   }
  // )

  return {
    data: [],
    isMagicWallet,
  }
}
