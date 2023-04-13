import { CryptoHookFactory } from '@_types/hooks'
import { Nft } from '@_types/nft'
import useLoading from '@hooks/common/useLoading'
import { ethers } from 'ethers'
import axiosClient from 'lib/fetcher/axiosInstance'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import useSWR from 'swr'

type UseOwnedNftsResponse = {
  // acceptOffer: (tokenId: number) => Promise<void>
  // listNft: (tokenId: number, price: number) => Promise<void>
}

type OwnedNftsHookFactory = CryptoHookFactory<UseOwnedNftsResponse>
export type UseOwnedNftsHook = ReturnType<OwnedNftsHookFactory>

export const hookFactory: OwnedNftsHookFactory =
  ({ ccNft, nftVendor, nftFractionToken, nftOffers, provider }) =>
  () => {
    const _ccNft = ccNft
    const _nftVendor = nftVendor

    const [activeNft, setActiveNft] = useState<Nft>()
    const [isApproved, setIsApproved] = useState(false)
    const [listPrice, setListPrice] = useState('')

    const {
      data,
      isLoading: isLoadingMe,
      isValidating: isValidatingMe,
    } = useSWR('/api/casks/me', async () => {
      const ownedNfts: any = await axiosClient.get('/api/casks/me')

      const nfts = [] as any[]

      for (let i = 0; i < ownedNfts.data.length; i++) {
        const item = ownedNfts.data[i]
        const transactions = await axiosClient.get(
          `/api/transactions?tokenId=${item.tokenId}`
        )
        nfts.push({
          ...item,
          transactions: transactions.data,
        })
      }
      return nfts
    })

    const {
      data: favorites,
      isLoading: favoritesIsLoading,
      isValidating: favoritesIsValidating,
    } = useSWR('/api/casks/favorites', async () => {
      const favoritesNfts: any = await axiosClient.get('/api/casks/favorites')
      console.log('FAVORITES', favoritesNfts)
      return favoritesNfts.data
    })

    const {
      data: dataBalances,
      isLoading: isLoadingBalances,
      isValidating: isValidatingBalances,
    } = useSWR(nftFractionToken ? '/api/user/balances' : null, async () => {
      const balances: any = await axiosClient.get('/api/user/balances')

      const balancesWithRedem = await Promise.all(
        balances.data.map(async (tokenAddress: any) => {
          try {
            const tokenContract = await nftFractionToken!(tokenAddress.address)
            const canRedem = await tokenContract.canRedeem()

            return {
              ...tokenAddress,
              canRedem,
            }
          } catch (e: any) {
            console.log(e)
          }
        })
      )

      return balancesWithRedem.filter(
        (tokenAddress: any) => tokenAddress.balance > 0
      )
    })

    const isLoading = isLoadingBalances || isLoadingMe
    const isValidating = isValidatingBalances || isValidatingMe

    useLoading({
      loading: isLoading || isValidating,
    })

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
        const gasPrice = await provider?.getGasPrice()

        console.log('nftVendor!.address', nftVendor!.address)

        const result = await _ccNft?.approve(
          nftVendor!.address as string,
          tokenId,
          {
            gasPrice,
            gasLimit: 100000,
          }
        )

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

    const listNft = async (tokenId: number) => {
      try {
        const result = await _nftVendor?.listItem(
          tokenId,
          ethers.utils.parseUnits(listPrice.toString(), 'ether')
        )
        await toast.promise(result!.wait(), {
          pending: 'Processing transaction',
          success: 'The NFT was listed',
          error: 'Processing error',
        })
        const txStatus = await result?.wait()
        if (txStatus?.status === 1) {
          setListPrice('')
        }
      } catch (e: any) {
        console.log(e)
      }
    }

    const handleActiveNft = (nft: Nft) => {
      if (activeNft?.tokenId === nft.tokenId) {
        setActiveNft(undefined)
      } else {
        setActiveNft(nft)
      }
    }

    // useEffect(() => {
    //   if (data && data.length > 0) {
    //     setActiveNft(undefined)
    //   } else {
    //     setActiveNft(undefined)
    //   }
    // }, [data])

    return {
      listNft,
      favorites,
      activeNft,
      listPrice,
      isLoading,
      isApproved,
      approveSell,
      acceptOffer,
      isValidating,
      setActiveNft,
      dataBalances,
      setListPrice,
      setIsApproved,
      handleActiveNft,
      redeemFractions,
      data: data || [],
    }
  }
