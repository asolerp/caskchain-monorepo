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

import useDebounce from '@hooks/common/useDebounce'

type CaskNftHookFactory = CryptoHookFactory<Nft[]>

export type UseCaskNftsHook = ReturnType<CaskNftHookFactory>

export const hookFactory: CaskNftHookFactory =
  ({
    nftOffers,
    nftVendor,
    nftFractionsVendor,
    nftFractionToken,
    erc20Contracts,
  }) =>
  ({ caskId }) => {
    const [successModal, setSuccessModal] = useState<boolean>(false)
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
        return {
          ...nfts,
        }
      },
      { revalidateOnFocus: true }
    )

    const {
      data: salesHistory,
      isLoading: salesHistoryIsLoading,
      // isValidating: latestOffersIsValidating,
    } = useSWR(
      'api/transactions/sales-history',
      async () => {
        const { data: salesHistoryData }: any = await axios.get(
          `/api/transactions/sales-history/${caskId}`
        )
        return salesHistoryData
      },
      { revalidateOnFocus: true }
    )

    const {
      data: latestOffers,
      isLoading: latestOffersIsLoading,
      // isValidating: latestOffersIsValidating,
    } = useSWR(
      'api/offers',
      async () => {
        const { data: offers }: any = await axios.get(`/api/offers/${caskId}`)
        return offers
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
      { revalidateOnFocus: true }
    )

    const isLoading = isLoadingNft
    const isValidating = isValidatingNft

    useLoading({
      loading:
        isLoading ||
        isValidating ||
        latestOffersIsLoading ||
        salesHistoryIsLoading,
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
      try {
        const response = await axiosClient.post(
          `/api/casks/${caskId}/favorite`,
          {
            userId: user?._id,
          }
        )

        setTotalFavorites(response?.data?.totalFavorites)
        setIsFavorite(!isFavorite)
      } catch (err) {
        toast.error("Couldn't add favorite", {
          theme: 'dark',
        })
      }
    }

    const debounceAddFavorite = useDebounce(() => handleAddFavorite(), 300)

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
          setSuccessModal(true)
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
          console.error(e)
        }
      },
      [_nftVendor, handleUserState, isUserNeededDataFilled]
    )

    const buyWithERC20 = useCallback(
      async (tokenId: number, price: string) => {
        const id = toast.loading('Buying barrel with USDT...', {
          closeOnClick: true,
        })
        try {
          if (isUserNeededDataFilled) {
            const txApprove = await erc20Contracts.USDT?.approve(
              _nftVendor?.address,
              price.toString()
            )

            const responseApprove: any = await txApprove!.wait()

            if (responseApprove.status !== 1) throw new Error('Approve failed')

            const txBuyWithERC20 = await _nftVendor?.buyNFTWithERC20(
              tokenId,
              process.env.NEXT_PUBILC_USDT_CONTRACT_ADDRESS as string
            )

            const responseBuyWithERC20: any = await txBuyWithERC20!.wait()

            if (responseBuyWithERC20.status !== 1)
              throw new Error('Buy with ERC20 failed')

            toast.update(id, {
              render: 'Barrel bought with USDT!',
              type: 'success',
              isLoading: false,
              closeOnClick: true,
              autoClose: 2000,
            })
          } else {
            handleUserState()
          }
          setSuccessModal(true)
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
        const result = await _nftOffers?.cancelOffer(caskId)
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
      latestOffers,
      isValidating,
      tokenAmmount,
      hasFractions,
      salesHistory,
      buyWithERC20,
      successModal,
      totalFavorites,
      setSuccessModal,
      handleShareCask,
      setTokenAmmount,
      hasOffersFromUser,
      buyFractionizedNft,
      debounceAddFavorite,
      isUserNeededDataFilled,
    }
  }
