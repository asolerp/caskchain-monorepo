import { useGlobal } from '@providers/global'
import { CryptoHookFactory } from '@_types/hooks'
import { Nft } from '@_types/nft'
import axios from 'axios'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import useSWR from 'swr'
import useLoading from '@hooks/common/useLoading'
import useFractionFactoryForm from '@hooks/common/useFractionFactoryForm'
import axiosClient from 'lib/fetcher/axiosInstance'

type CaskNftHookFactory = CryptoHookFactory<Nft[]>

export type UseCaskNftsHook = ReturnType<CaskNftHookFactory>

export const hookFactory: CaskNftHookFactory =
  ({ ccNft, nftVendor }) =>
  ({ caskId }) => {
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

    const [isFavorite, setIsFavorite] = useState<boolean>(false)

    const {
      state: { user, address },
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
        const gasPriceApprove = await ccNft?.methods
          .approve(nftVendor!.address as string, caskId)
          .estimateGas({ from: address })

        const txApprove = await ccNft?.methods
          ?.approve(nftVendor!.address as string, caskId)
          .send({
            from: address,
            gas: gasPriceApprove,
          })

        if (!txApprove.status) throw new Error('Approve failed')

        const gasPriceList = await _nftVendor?.methods
          .updateERC20TokenPrice(
            caskId,
            process.env.NEXT_PUBILC_USDT_CONTRACT_ADDRESS,
            ethers.utils.parseUnits(erc20ListPrice.toString(), 'ether')
          )
          .estimateGas({ from: address })

        const txList = await _nftVendor
          ?.updateERC20TokenPrice(
            caskId,
            process.env.NEXT_PUBILC_USDT_CONTRACT_ADDRESS,
            ethers.utils.parseUnits(erc20ListPrice.toString(), 'ether')
          )
          .send({
            from: address,
            gas: gasPriceList,
          })

        if (!txList.status) throw new Error('Listing failed')

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

    const updateNftSaleState = async (state: boolean) => {
      const id = toast.loading('Updating barrel state...')
      try {
        const gasPriceApprove = await ccNft?.methods
          ?.approve(nftVendor!._address as string, caskId)
          ?.estimateGas({ from: address })

        const txApprove = await ccNft?.methods
          ?.approve(nftVendor!._address as string, caskId)
          .send({
            from: address,
            gas: gasPriceApprove,
          })

        if (!txApprove.status) throw new Error('Approve failed')

        const gasPriceSale = await _nftVendor?.methods
          ?.updateStateForSale(caskId, state)
          .estimateGas({ from: address })

        const txSale = await _nftVendor?.methods
          ?.updateStateForSale(caskId, state)
          .send({
            from: address,
            gas: gasPriceSale,
          })

        if (!txSale.status) throw new Error('Listing failed')

        await refetchNft()

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
        await axios.post(`/api/casks/${caskId}/best-barrel`, {
          bestBarrel: state,
        })

        await refetchNft()

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
        const gasPriceApprove = await ccNft?.methods
          ?.approve(nftVendor!.address as string, caskId)
          ?.estimateGas({ from: address })

        const txApprove = await ccNft?.methods
          ?.approve(nftVendor!.address as string, caskId)
          .send({
            from: address,
            gas: gasPriceApprove,
          })

        if (!txApprove.status) throw new Error('Approve failed')

        const gasPriceList = await _nftVendor?.methods
          .updateListingPrice(
            caskId,
            ethers.utils.parseUnits(listPrice.toString(), 'ether')
          )
          .estimateGas({ from: address })

        const txList = await _nftVendor?.methods
          ?.updateListingPrice(
            caskId,
            ethers.utils.parseUnits(listPrice.toString(), 'ether')
          )
          .send({
            from: address,
            gas: gasPriceList,
          })

        if (!txList.status) throw new Error('Listing failed')

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
      data,
      isLoading,
      formState,
      isFavorite,
      salesHistory,
      hasFractions,
      tokenAmmount,
      setListPrice,
      latestOffers,
      isValidating,
      erc20ListPrice,
      updateNftPrice,
      createFraction,
      setTokenAmmount,
      updateERC20Price,
      setERC20ListPrice,
      updateNftSaleState,
      updateNftBestBarel,
      handleFormFractionsChange: handleChange,
      totalFavorites: totalFavoritesData?.totalFavorites,
    }
  }
