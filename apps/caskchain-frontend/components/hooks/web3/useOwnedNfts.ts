import { CryptoHookFactory } from '@_types/hooks'
import { Nft } from '@_types/nft'

import { LoadingContext } from 'components/contexts/LoadingContext'
// import { useGlobal } from '@providers/global'
import { getCookie } from 'cookies-next'
import { ethers } from 'ethers'
import axiosClient from 'lib/fetcher/axiosInstance'
import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import useSWR from 'swr'
// import { useAccount } from 'wagmi'

type UseOwnedNftsResponse = {
  // acceptOffer: (tokenId: number) => Promise<void>
  // listNft: (tokenId: number, price: number) => Promise<void>
}

type OwnedNftsHookFactory = CryptoHookFactory<UseOwnedNftsResponse>
export type UseOwnedNftsHook = ReturnType<OwnedNftsHookFactory>

export const hookFactory: OwnedNftsHookFactory =
  ({ ccNft, ethereum, nftVendor, nftFractionToken, nftOffers, provider }) =>
  () => {
    const token = getCookie('token')

    const _ccNft = ccNft

    const [activeNft, setActiveNft] = useState<Nft>()
    const [isApproved, setIsApproved] = useState(false)
    const [listPrice, setListPrice] = useState('')

    const { setIsLoading } = useContext(LoadingContext)

    const {
      data,
      isLoading: isLoadingMe,
      isValidating: isValidatingMe,
    } = useSWR(
      token ? '/api/casks/me' : null,
      async () => {
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
      },
      {
        revalidateOnFocus: false,
      }
    )

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

    // const {
    //   data: dataBalances,
    //   isLoading: isLoadingBalances,
    //   isValidating: isValidatingBalances,
    // } = useSWR(nftFractionToken ? '/api/user/balances' : null, async () => {
    //   const balances: any = await axiosClient.get('/api/user/balances')

    //   const balancesWithRedem = await Promise.all(
    //     balances.data.map(async (tokenAddress: any) => {
    //       try {
    //         const tokenContract = await nftFractionToken!(tokenAddress.address)
    //         const canRedem = await tokenContract.canRedeem()

    //         return {
    //           ...tokenAddress,
    //           canRedem,
    //         }
    //       } catch (e: any) {
    //         console.log(e)
    //       }
    //     })
    //   )

    //   return balancesWithRedem.filter(
    //     (tokenAddress: any) => tokenAddress.balance > 0
    //   )
    // })

    useEffect(() => {
      setIsLoading(isLoadingMe || isValidatingMe)
    }, [isLoadingMe, isValidatingMe])

    console.log('ISLOADINGME', isLoadingMe)

    // useLoading({
    //   loading: isLoadingMe,
    // })

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

    const listNft = async (tokenId: number, price: string) => {
      const id = toast.loading('Listing new barrel...')
      try {
        const gasPrice = await provider?.getGasPrice()

        const txApprove = await ccNft?.approve(
          nftVendor!.address as string,
          tokenId,
          {
            gasPrice,
            gasLimit: 100000,
          }
        )

        const responseApprove: any = await txApprove!.wait()

        if (responseApprove.status !== 1) throw new Error('Approve failed')

        const txList = await nftVendor?.listItem(
          tokenId,
          ethers.utils.parseUnits(price.toString(), 'ether')
        )

        const responseList: any = await txList!.wait()

        if (responseList.status !== 1) throw new Error('Listing failed')

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
      // try {
      //   const result = await _nftVendor?.listItem(
      //     tokenId,
      //     ethers.utils.parseUnits(listPrice.toString(), 'ether')
      //   )
      //   await toast.promise(result!.wait(), {
      //     pending: 'Processing transaction',
      //     success: 'The NFT was listed',
      //     error: 'Processing error',
      //   })
      //   const txStatus = await result?.wait()
      //   if (txStatus?.status === 1) {
      //     setListPrice('')
      //   }
      // } catch (e: any) {
      //   console.log(e)
      // }
    }

    const handleActiveNft = (nft: Nft) => {
      if (activeNft?.tokenId === nft.tokenId) {
        setActiveNft(undefined)
      } else {
        setActiveNft(nft)
      }
    }

    const addNFTToMetaMask = async (tokenId: string) => {
      try {
        // Check if the MetaMask extension is installed

        // Request the user to add the NFT to their MetaMask wallet
        const added = await ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20', // ERC721 for NFTs
            options: {
              address: _ccNft!.address,
              decimals: 0, // NFT contract address
              symbol: 'CSKNFT', // NFT symbol or abbreviation
              tokenId: tokenId, // NFT token ID
            },
          },
        })

        if (added) {
          console.log('NFT added to MetaMask')
        } else {
          console.log('NFT not added to MetaMask')
        }
      } catch (error) {
        console.error('Error adding NFT to MetaMask:', error)
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
      addNFTToMetaMask,
      data: data || [],
    }
  }
