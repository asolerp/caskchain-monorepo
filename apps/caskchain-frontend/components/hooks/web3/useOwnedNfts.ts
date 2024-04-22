import { Nft } from '@_types/nft'
import { useGlobal } from '@providers/global'
import { useWeb3 } from 'caskchain-lib/provider/web3'
import { useQuery } from '@tanstack/react-query'

import { LoadingContext } from 'components/contexts/LoadingContext'
// import { useGlobal } from '@providers/global'
import { getCookie } from 'cookies-next'
import { ethers } from 'ethers'
import axiosClient from 'lib/fetcher/axiosInstance'
import { getOwnedNfts } from 'pages/api/nfts/getOwnedNfts'
import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import useSWR from 'swr'
import { useAuth } from 'components/contexts/AuthContext'

export const useOwnedNfts = () => {
  const { ccNft, nftOffers, nftVendor, provider, nftFractionToken } = useWeb3()
  const token = getCookie('token')
  const {
    state: { address },
  } = useGlobal()
  const _ccNft = ccNft

  const { currentUser } = useAuth()

  const [activeNft, setActiveNft] = useState<Nft>()
  const [isApproved, setIsApproved] = useState(false)
  const [listPrice, setListPrice] = useState('')

  const { setIsLoading } = useContext(LoadingContext)

  const { data, isLoading } = useQuery({
    queryKey: ['getOwnedNfts', currentUser?.uid],
    queryFn: async () => getOwnedNfts({ currentUser }),
  })

  // const {
  //   data,
  //   isLoading: isLoadingMe,
  //   isValidating: isValidatingMe,
  // } = useSWR(
  //   token ? '/api/casks/me' : null,
  //   async () => {
  //     const ownedNfts: any = await axiosClient.get('/api/casks/me')
  //     const nfts = [] as any[]

  //     for (let i = 0; i < ownedNfts.data.length; i++) {
  //       const item = ownedNfts.data[i]
  //       const transactions = await axiosClient.get(
  //         `/api/transactions?tokenId=${item.tokenId}`
  //       )
  //       nfts.push({
  //         ...item,
  //         transactions: transactions.data,
  //       })
  //     }
  //     return nfts
  //   },
  //   {
  //     revalidateOnFocus: false,
  //   }
  // )

  const { data: favorites } = useSWR(
    token ? '/api/casks/favorites' : null,
    async () => {
      const favoritesNfts: any = await axiosClient.get('/api/casks/favorites')
      return favoritesNfts.data
    },
    {
      revalidateOnFocus: false,
    }
  )

  // useEffect(() => {
  //   setIsLoading(isLoadingMe || isValidatingMe)
  // }, [isLoadingMe, isValidatingMe, setIsLoading])

  const redeemFractions = async (tokenAddress: string, amount: number) => {
    try {
      const tokenContract = await nftFractionToken!(tokenAddress)
      const result = await tokenContract.redeem(amount)
      await toast.promise(result.wait(), {
        pending: 'Processing transaction',
        success: 'The redem was successful',
        error: 'Processing error',
      })
    } catch (e: any) {
      console.log(e)
    }
  }

  const acceptOffer = async (tokenId: string) => {
    try {
      await _ccNft
        ?.approve(nftOffers!.address as string, tokenId)
        .then(async () => {
          const result = await nftOffers?.acceptOffer(tokenId)
          await toast.promise(result!.wait(), {
            pending: 'Processing transaction',
            success: 'The sell was approved',
            error: 'Processing error',
          })
        })
    } catch (e: any) {
      console.log(e)
    }
  }

  const approveSell = async (tokenId: number) => {
    try {
      const gasPrice = await provider?.methods?.approve?.estimateGas({
        from: address,
      })

      const result = await _ccNft?.methods
        ?.approve(nftVendor!.address as string, tokenId)
        .send({
          gas: gasPrice,
          from: address,
        })

      await toast.promise(result!.wait(), {
        pending: 'Processing transaction',
        success: 'The sell was approved',
        error: 'Processing error',
      })
      const txStatus = await result?.wait()
      if (txStatus?.status === 1) {
        setIsApproved(true)
      }
    } catch (e: any) {
      console.log('ERROR', e)
    }
  }

  const listNft = async (tokenId: number, price: string) => {
    const id = toast.loading('Listing new barrel...')
    try {
      const txApprove = await ccNft?.methods
        ?.approve(nftVendor!._address as string, tokenId)
        .send({
          from: address,
        })

      if (!txApprove.status) throw new Error('Approve failed')

      const txList = await nftVendor?.methods
        ?.listItem(tokenId, ethers.parseUnits(price.toString(), 'ether'), true)
        .send({
          from: address,
        })

      if (!txList.status) throw new Error('Listing failed')

      toast.update(id, {
        render: 'NFT listed',
        type: 'success',
        isLoading: false,
        closeOnClick: true,
        autoClose: 2000,
      })
    } catch (e: any) {
      toast.update(id, {
        render: 'Something went wrong',
        type: 'error',
        isLoading: false,
        closeOnClick: true,
        autoClose: 2000,
      })
      console.error(e.message)
    }
  }

  const handleActiveNft = (nft: Nft) => {
    if (activeNft?.tokenId === nft.tokenId) {
      setActiveNft(undefined)
    } else {
      setActiveNft(nft)
    }
  }

  return {
    listNft,
    favorites,
    activeNft,
    listPrice,
    // isLoading,
    isApproved,
    approveSell,
    acceptOffer,
    // isValidating,
    setActiveNft,
    // dataBalances,
    setListPrice,
    setIsApproved,
    handleActiveNft,
    redeemFractions,
    data: data?.nfts || [],
  }
}
