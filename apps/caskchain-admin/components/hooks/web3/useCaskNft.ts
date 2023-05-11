import { useGlobal } from '@providers/global'
import { CryptoHookFactory } from '@_types/hooks'
import { Nft } from '@_types/nft'
import axios from 'axios'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import useSWR from 'swr'
import { useProvider } from 'wagmi'
import useLoading from '@hooks/common/useLoading'

type CaskNftHookFactory = CryptoHookFactory<Nft[]>

export type UseCaskNftsHook = ReturnType<CaskNftHookFactory>

export const hookFactory: CaskNftHookFactory =
  ({ ccNft, nftVendor }) =>
  ({ caskId }) => {
    const [tokenAmmount, setTokenAmmount] = useState<number | undefined>(0)
    const [listPrice, setListPrice] = useState<number>(0)
    const [erc20ListPrice, setERC20ListPrice] = useState<number>(0)
    const provider = useProvider()
    const [isFavorite, setIsFavorite] = useState<boolean>(false)

    const {
      state: { user },
    } = useGlobal()

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
      mutate: refetchNft,
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
      { revalidateOnFocus: true }
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
      loading: isLoading || latestOffersIsLoading || salesHistoryIsLoading,
    })

    const _nftVendor = nftVendor

    const hasFractions = data?.fractions?.total

    const updateERC20Price = async () => {
      const id = toast.loading('Pricing barrel...')
      try {
        const gasPrice = await provider?.getGasPrice()

        const txApprove = await ccNft?.approve(
          nftVendor!.address as string,
          caskId,
          {
            gasPrice,
            gasLimit: 100000,
          }
        )

        const responseApprove: any = await txApprove!.wait()

        if (responseApprove.status !== 1) throw new Error('Approve failed')

        const txList = await _nftVendor?.updateERC20TokenPrice(
          caskId,
          process.env.NEXT_PUBILC_USDT_CONTRACT_ADDRESS,
          ethers.utils.parseUnits(erc20ListPrice.toString(), 'ether')
        )

        const responseList: any = await txList!.wait()

        if (responseList.status !== 1) throw new Error('Listing failed')

        await refetchNft()

        toast.update(id, {
          render: 'Barrel price updated',
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
        console.log(e)
      }
    }

    const updateNftPrice = async () => {
      const id = toast.loading('Pricing barrel...')
      try {
        const gasPrice = await provider?.getGasPrice()

        const txApprove = await ccNft?.approve(
          nftVendor!.address as string,
          caskId,
          {
            gasPrice,
            gasLimit: 100000,
          }
        )

        const responseApprove: any = await txApprove!.wait()

        if (responseApprove.status !== 1) throw new Error('Approve failed')

        const txList = await _nftVendor?.updateListingPrice(
          caskId,
          ethers.utils.parseUnits(listPrice.toString(), 'ether')
        )

        const responseList: any = await txList!.wait()

        if (responseList.status !== 1) throw new Error('Listing failed')

        await refetchNft()

        toast.update(id, {
          render: 'Barrel price updated',
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
        console.log(e)
      }
    }

    return {
      data,
      updateNftPrice,
      updateERC20Price,
      setERC20ListPrice,
      erc20ListPrice,
      isLoading,
      isFavorite,
      latestOffers,
      isValidating,
      setListPrice,
      tokenAmmount,
      hasFractions,
      salesHistory,
      setTokenAmmount,
      totalFavorites: totalFavoritesData?.totalFavorites,
    }
  }
