import { CryptoHookFactory } from '@_types/hooks'
import useLoading from '@hooks/common/useLoading'
import { useGlobal } from '@providers/global'

import axiosClient from 'lib/fetcher/axiosInstance'
import { useState } from 'react'
import { toast } from 'react-toastify'
import useSWR from 'swr'

type UseMyActivityResponse = {
  sentOffers: any[]
  // makeOffer: (_tokenId: number, offer: string) => Promise<void>
}

type MyActivityHookFactory = CryptoHookFactory<UseMyActivityResponse>

export type UseMyActivityHook = ReturnType<MyActivityHookFactory>

export const hookFactory: MyActivityHookFactory =
  ({ ccNft, nftOffers }) =>
  () => {
    const [loadingTransactions, setLoadingTransactions] = useState(false)
    const {
      state: { address },
    } = useGlobal()

    const {
      data: transactions,
      isLoading: transactionsLoading,
      isValidating: transactionsValidating,
      mutate: transactionsRefetch,
    } = useSWR(
      '/api/transactions',
      async () => {
        const offers: any = await axiosClient.get(
          `/api/transactions?wallet_address=${address}`
        )
        return offers.data
      },
      {
        revalidateOnFocus: false,
        revalidateOnMount: false,
      }
    )

    const {
      data: sentOffers,
      isLoading: sentOffersLoading,
      isValidating: sentOffersValidating,
      mutate: sentOffersRefetch,
    } = useSWR(
      '/api/offers/sent',
      async () => {
        const offers: any = await axiosClient.get('/api/offers/sent')
        return offers.data
      },
      {
        revalidateOnFocus: false,
        revalidateOnMount: false,
      }
    )

    const {
      data: receivedOffers,
      isLoading: receivedOffersLoading,
      isValidating: receivedOffersValidating,
      mutate: receivedOffersRefetch,
    } = useSWR('/api/offers/received', async () => {
      const offers: any = await axiosClient.get('/api/offers/received')
      return offers.data
    })

    const _ccNft = ccNft
    const _nftOffers = nftOffers

    const isLoading =
      sentOffersLoading || receivedOffersLoading || transactionsLoading
    const isValidating =
      sentOffersValidating || receivedOffersValidating || transactionsValidating

    useLoading({ loading: isLoading || isValidating })

    const acceptOffer = async (tokenId: string) => {
      setLoadingTransactions(true)
      const id = toast.loading('Accepting offer...')

      console.log('_nftOffers', _nftOffers)

      try {
        const gasPriceApprove = await _ccNft?.methods
          .approve(_nftOffers!._address as string, tokenId)
          .estimateGas({ from: address })

        const txApprove = await ccNft?.methods
          ?.approve(_nftOffers!._address as string, tokenId)
          .send({
            from: address,
            gas: gasPriceApprove,
          })

        if (!txApprove.status) throw new Error('Approve failed')

        const gasPriceAcceptOffer = await _nftOffers?.methods
          .acceptOffer(tokenId)
          .estimateGas({ from: address })

        const txAcceptOffer = await _nftOffers?.methods
          ?.acceptOffer(tokenId)
          .send({
            from: address,
            gas: gasPriceAcceptOffer,
          })

        if (!txAcceptOffer.status) throw new Error('Listing failed')

        receivedOffersRefetch()
      } catch (e: any) {
        console.log(e)
      } finally {
        setLoadingTransactions(false)
        toast.update(id, {
          render: 'Cancel offer success',
          type: 'success',
          isLoading: false,
          closeOnClick: true,
          autoClose: 2000,
        })
      }
    }

    const cancelOffer = async (tokenId: string) => {
      setLoadingTransactions(true)
      const id = toast.loading('Canceling offer...')
      try {
        const txCancelOffer = await _nftOffers?.methods
          ?.cancelOffer(tokenId)
          .send({
            from: address,
          })
        if (!txCancelOffer.status) throw new Error('Cancel offer Nft failed')

        toast.update(id, {
          render: 'Cancel offer success',
          type: 'success',
          isLoading: false,
          closeOnClick: true,
          autoClose: 2000,
        })
      } catch (e: any) {
        console.log(e)
      } finally {
        setLoadingTransactions(false)
      }
    }

    return {
      receivedOffersValidating,
      receivedOffersLoading,
      receivedOffersRefetch,
      sentOffersValidating,
      loadingTransactions,
      transactionsRefetch,
      sentOffersLoading,
      sentOffersRefetch,
      receivedOffers,
      transactions,
      cancelOffer,
      acceptOffer,
      sentOffers,
    }
  }
