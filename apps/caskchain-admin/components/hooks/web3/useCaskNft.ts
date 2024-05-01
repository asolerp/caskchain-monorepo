import { useGlobal } from '@providers/global'

import axios from 'axios'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import useSWR from 'swr'
import useLoading from '@hooks/common/useLoading'
import useFractionFactoryForm from '@hooks/common/useFractionFactoryForm'
import axiosClient from 'lib/fetcher/axiosInstance'
import { sendTransaction } from 'caskchain-lib/provider/web3/utils'
import { useWeb3 } from 'caskchain-lib/provider/web3'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getNft } from 'pages/api/nfts/getNft'
import { updateBestBarrel } from 'pages/api/nfts/updateBestBarrel'
import { BASE_URL } from 'pages/api/utils'

export const useCaskNft = ({ caskId }: any) => {
  const { nftVendor, ccNft } = useWeb3()

  const [formState, handleChange] = useFractionFactoryForm({
    tokenName: '',
    tokenSymbol: '',
    tokenSupply: '',
    tokenFee: '',
    tokenListingPrice: '',
  })

  const [tokenAmmount, setTokenAmmount] = useState<number | undefined>(0)
  const [listPrice, setListPrice] = useState<number>(0)
  const [erc20ListPrice, setERC20ListPrice] = useState<number>(0)
  const [bestBarrel, setBestBarrel] = useState(false)
  const [isInSale, setIsInSale] = useState(false)

  const queryClient = useQueryClient()

  const {
    state: { address },
  } = useGlobal()

  const { data, refetch, isLoading, isPending } = useQuery({
    queryKey: ['getCask', caskId],
    queryFn: async () => getNft({ tokenId: caskId }),
  })

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
    { revalidateOnFocus: false }
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

  const isValidating = isPending

  useLoading({
    loading: isLoading || latestOffersIsLoading || salesHistoryIsLoading,
  })

  useEffect(() => {
    console.log('data', data)
    if (data) {
      setIsInSale(data?.cask?.active)
      setBestBarrel(data?.cask?.bestBarrel)
    }
  }, [data?.cask])

  const _nftVendor = nftVendor

  const hasFractions = data?.fractions?.total

  const updateERC20Price = async () => {
    const id = toast.loading('Pricing barrel...')
    console.log('Price', erc20ListPrice)

    try {
      await axios.post(
        'https://europe-west1-cask-chain.cloudfunctions.net/updateERC20TokenPrice',
        {
          tokenId: caskId,
          erc20ListPrice,
        }
      )

      await refetch()

      toast.update(id, {
        render: 'Barrel USDT price updated',
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

  const updateNftSaleState = async (state: boolean) => {
    const id = toast.loading('Updating barrel state...')
    try {
      await axios.post(
        'https://europe-west1-cask-chain.cloudfunctions.net/updateSaleState',
        {
          tokenId: caskId,
          state,
        }
      )

      await refetch()

      toast.update(id, {
        render: 'Sale state updated',
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

  const updateNftBestBarel = async (state: boolean) => {
    const id = toast.loading('Updating barrel state...')
    try {
      await axios.post(`${BASE_URL}/updateBestBarrel`, {
        tokenId: caskId,
        state,
      })

      queryClient.invalidateQueries({ queryKey: ['getCask', caskId] })

      toast.update(id, {
        render: 'Sale state updated',
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
      const txApprove = await ccNft?.methods?.approve(
        nftVendor._address as string,
        caskId
      )

      await sendTransaction(address, true, txApprove, 10)

      const txList = await _nftVendor?.methods.updateListingPrice(
        caskId,
        ethers.utils.parseUnits(listPrice.toString(), 'ether')
      )

      await sendTransaction(address, true, txList, 10)

      await refetch()

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

  const createFraction = async () => {
    const id = toast.loading('Creating fractions...')
    try {
      // const gasPrice = await provider?.getGasPrice()

      // const txApprove = await ccNft?.approve(
      //   _nftFractionFactory!.address as string,
      //   caskId,
      //   {
      //     gasPrice,
      //     gasLimit: 100000,
      //   }
      // )

      // const responseApprove: any = await txApprove!.wait()

      // if (responseApprove.status !== 1) throw new Error('Approve failed')

      // const txList = await _nftFractionFactory?.mint(
      //   formState.tokenName,
      //   formState.tokenSymbol,
      //   ccNft!.address,
      //   caskId,
      //   (formState.tokenSupply * 10 ** 18).toString(),
      //   formState.tokenFee * 100,
      //   (formState.tokenListingPrice * 10 ** 18).toString()
      // )

      // const responseList: any = await txList!.wait()

      // if (responseList.status !== 1) throw new Error('Listing failed')
      await axiosClient.post('/api/casks/fractionalizeToken', {
        name: formState.tokenName,
        symbol: formState.tokenSymbol,
        collection: ccNft!.address,
        tokenId: caskId,
        supply: (formState.tokenSupply * 10 ** 18).toString(),
        fee: (formState.tokenFee * 100).toString(),
        listingPrice: (formState.tokenListingPrice * 10 ** 18).toString(),
      })

      await refetchNft()
      toast.update(id, {
        render: 'Fractions created',
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
    data: data?.cask,
    isLoading,
    isInSale,
    listPrice,
    formState,
    bestBarrel,
    setIsInSale,
    salesHistory,
    hasFractions,
    tokenAmmount,
    setListPrice,
    latestOffers,
    isValidating,
    setBestBarrel,
    erc20ListPrice,
    updateNftPrice,
    createFraction,
    setTokenAmmount,
    updateERC20Price,
    setERC20ListPrice,
    updateNftSaleState,
    updateNftBestBarel,
    handleFormFractionsChange: handleChange,
  }
}
