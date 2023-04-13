import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'
import { AcceptedChainIds } from '@providers/web3/utils'
import { CryptoHookFactory } from '@_types/hooks'
import { Nft } from '@_types/nft'
import axios from 'axios'
import { getCookie } from 'cookies-next'
import { ethers } from 'ethers'
import axiosClient from 'lib/fetcher/axiosInstance'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import useSWR from 'swr'
import { useNetwork, useProvider } from 'wagmi'
import useLoading from '@hooks/common/useLoading'

type CaskNftHookFactory = CryptoHookFactory<Nft[]>

export type UseCaskNftsHook = ReturnType<CaskNftHookFactory>

export const hookFactory: CaskNftHookFactory =
  ({ nftOffers, nftVendor, nftFractionsVendor, nftFractionToken }) =>
  ({ caskId }) => {
    const [tokenAmmount, setTokenAmmount] = useState<number | undefined>(0)
    const [totalFavorites, setTotalFavorites] = useState<number | undefined>(0)
    const { chain } = useNetwork()
    const provider = useProvider()
    const [isFavorite, setIsFavorite] = useState<boolean>(false)

    const {
      state: { user },
      dispatch,
    } = useGlobal()

    const token = getCookie('token')

    useEffect(() => {
      if (user?.favorites?.[caskId]) {
        setIsFavorite(true)
      } else {
        setIsFavorite(false)
      }
    }, [user, caskId])

    const {
      data,
      isLoading: isLoadingNft,
      isValidating: isValidatingNft,
    } = useSWR(
      'web3/useCaskNft',
      async () => {
        const { data: nfts }: any = await axios.get(`/api/casks/${caskId}`)
        const transactions = await axiosClient.get(
          `/api/transactions?tokenId=${caskId}`
        )
        if (transactions.data.length) {
          nfts.transactions = transactions.data
        }
        return {
          ...nfts,
        }
      },
      { revalidateOnFocus: false }
    )

    const { data: totalFavoritesData } = useSWR(
      'api/casks/:caskId/totalFavorites',
      async () => {
        const {
          data: { totalFavorites },
        }: any = await axios.get(`/api/casks/${caskId}/totalFavorites`)
        return totalFavorites
      },
      { revalidateOnFocus: false }
    )

    const isLoading = isLoadingNft
    const isValidating = isValidatingNft

    useLoading({
      loading: isLoading || isValidating,
    })

    const _nftOffers = nftOffers
    const _nftVendor = nftVendor
    const _nftFractionsVendor = nftFractionsVendor

    const isUserNeededDataFilled =
      user?.email && token && AcceptedChainIds.some((id) => id === chain?.id)
    const hasOffersFromUser = data?.offer?.bidders?.some(
      (bidder: string) => bidder === user?.address
    )

    useEffect(() => {
      setTotalFavorites(totalFavoritesData)
    }, [totalFavoritesData])

    const handleAddFavorite = async () => {
      const response = await axiosClient
        .post(`/api/casks/${caskId}/favorite`, {
          userId: user?._id,
        })
        .catch((err: any) => {
          toast.error(err?.response?.data?.message)
        })
      setTotalFavorites(response?.data?.totalFavorites)
      setIsFavorite(!isFavorite)
    }

    const handleShareCask = () => {
      dispatch({
        type: GlobalTypes.SET_SHARE_MODAL,
        payload: { status: true },
      })
    }

    const handleUserState = useCallback(() => {
      if (
        provider.chains &&
        provider.chains.some((c: any) =>
          AcceptedChainIds.some((aChainId) => aChainId === c)
        )
      ) {
        return dispatch({
          type: GlobalTypes.SET_NETWORK_MODAL,
          payload: { status: true },
        })
      }
      if (!user?.email) {
        return dispatch({
          type: GlobalTypes.SET_USER_INFO_MODAL,
          payload: { status: true },
        })
      }
      if (!token) {
        return dispatch({
          type: GlobalTypes.SET_SIGN_IN_MODAL,
          payload: { status: true },
        })
      }
    }, [dispatch, token, user?.email])

    const hasFractions = data?.fractions?.total

    const buyNft = useCallback(
      async (tokenId: number, price: string) => {
        try {
          if (isUserNeededDataFilled) {
            const result = await _nftVendor?.buyItem(tokenId, {
              value: price.toString(),
            })
            await toast.promise(result!.wait(), {
              pending: 'Processing transaction',
              success: 'Nft is yours! Go to Profile page',
              error: 'Processing error',
            })
          } else {
            handleUserState()
          }
        } catch (e: any) {
          if (e.code === -32603) {
            toast.error('🏦 Insufficient funds', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
            })
          }
          console.error(e.message)
        }
      },
      [_nftVendor, handleUserState, isUserNeededDataFilled]
    )

    const buyFractionizedNft = useCallback(async () => {
      try {
        if (isUserNeededDataFilled) {
          const listingPrice = data?.fractions?.listingPrice.toString()

          const _signedTokenContract = await nftFractionToken(
            data?.fractions?.tokenAddress
          )

          await _signedTokenContract.purchase({
            value: listingPrice,
          })
        } else {
          handleUserState()
        }
      } catch (err) {
        console.log(err)
      }
    }, [
      isUserNeededDataFilled,
      data?.fractions?.tokenAddress,
      data?.fractions?.listingPrice,
      handleUserState,
    ])

    const buyFractions = useCallback(
      async (
        tokenAddress: string,
        unitPrice: number,
        numberOfFractions: number
      ) => {
        try {
          if (isUserNeededDataFilled) {
            const value =
              Number(
                ethers.utils.parseUnits(
                  numberOfFractions!.toString() as string,
                  'ether'
                )
              ) / unitPrice

            await _nftFractionsVendor?.buyTokens(tokenAddress, {
              value: value.toString(),
            })
          } else {
            handleUserState()
          }
        } catch (err) {
          console.error(err)
        }
      },
      [isUserNeededDataFilled, _nftFractionsVendor, handleUserState]
    )

    const makeOffer = useCallback(
      async (bid: string) => {
        try {
          if (isUserNeededDataFilled) {
            const result = await _nftOffers?.makeOffer(caskId, {
              value: ethers.utils.parseUnits(bid.toString(), 'ether'),
            })
            await toast.promise(result!.wait(), {
              pending: 'Processing transaction',
              success: 'You are the highest bidder!',
              error: 'Processing error',
            })
          } else {
            handleUserState()
          }
        } catch (e: any) {
          console.error('ERROR', e)
          toast.info('🏦 There is a higher offer. Bid harder!')
        }
      },
      [caskId, _nftOffers, handleUserState, isUserNeededDataFilled]
    )

    const cancelOffer = useCallback(async () => {
      try {
        const result = await _nftOffers?.withdraw(caskId)
        await toast.promise(result!.wait(), {
          pending: 'Processing transaction',
          success: 'Your offer is canceled',
          error: 'Processing error',
        })
      } catch (e: any) {
        console.log(e)
      }
    }, [_nftOffers, caskId])

    return {
      data,
      buyNft,
      makeOffer,
      isLoading,
      isFavorite,
      cancelOffer,
      buyFractions,
      isValidating,
      tokenAmmount,
      hasFractions,
      totalFavorites,
      handleShareCask,
      setTokenAmmount,
      handleAddFavorite,
      hasOffersFromUser,
      buyFractionizedNft,
    }
  }
