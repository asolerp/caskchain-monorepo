import { useWeb3 } from 'caskchain-lib/provider/web3'
import { getOwnedNfts } from 'pages/api/nfts/getOwnedNfts'
import { useQuery } from '@tanstack/react-query'

// import { useGlobal } from '@providers/global'
// import { deleteCookie } from 'cookies-next'
// import axiosClient from 'lib/fetcher/axiosInstance'

// import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuth } from 'components/contexts/AuthContext'

// import useSWR from 'swr'

export const useSideBar = () => {
  const [isMagicWallet, setIsMagicWallet] = useState<string>('')
  const { web3 } = useWeb3()
  const { currentUser } = useAuth()

  useEffect(() => {
    const getWalletType = async () => {
      const isMagicWallet = await web3.currentProvider.isMagic
      setIsMagicWallet(isMagicWallet)
    }
    if (web3) {
      getWalletType()
    }
  }, [web3])

  const { data } = useQuery({
    queryKey: ['getOwnedNfts', (currentUser as any)?.uid],
    queryFn: async () => getOwnedNfts({ currentUser }),
  })

  return {
    data: data?.nfts,
    isMagicWallet,
  }
}
