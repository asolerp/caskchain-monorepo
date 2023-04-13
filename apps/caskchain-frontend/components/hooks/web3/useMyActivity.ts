import { CryptoHookFactory } from '@_types/hooks'
import useLoading from '@hooks/common/useLoading'
import axiosClient from 'lib/fetcher/axiosInstance'
import { toast } from 'react-toastify'
import useSWR from 'swr'
import { useAccount } from 'wagmi'

type UseMyActivityResponse = {
  sentOffers: any[]
  // makeOffer: (_tokenId: number, offer: string) => Promise<void>
}

type MyActivityHookFactory = CryptoHookFactory<UseMyActivityResponse>

export type UseMyActivityHook = ReturnType<MyActivityHookFactory>

export const hookFactory: MyActivityHookFactory =
  ({ ccNft, nftOffers }) =>
  () => {
    const { address } = useAccount()

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
    } = useSWR(
      '/api/offers/received',
      async () => {
        const offers: any = await axiosClient.get('/api/offers/received')
        return offers.data
      },
      {
        revalidateOnFocus: false,
        revalidateOnMount: false,
      }
    )

    const _ccNft = ccNft
    const _nftOffers = nftOffers

    const isLoading =
      sentOffersLoading || receivedOffersLoading || transactionsLoading
    const isValidating =
      sentOffersValidating || receivedOffersValidating || transactionsValidating

    useLoading({ loading: isLoading || isValidating })

    const acceptOffer = async (tokenId: string) => {
      try {
        await _ccNft
          ?.approve(_nftOffers!.address as string, tokenId)
          .then(async () => {
            const result = await _nftOffers?.acceptOffer(tokenId)
            await toast.promise(result!.wait(), {
              pending: 'Processing transaction',
              success: 'The sell was approved',
              error: 'Processing error',
            })
          })
        receivedOffersRefetch()
      } catch (e: any) {
        console.log(e)
      }
    }

    return {
      receivedOffersValidating,
      receivedOffersLoading,
      receivedOffersRefetch,
      sentOffersValidating,
      transactionsRefetch,
      sentOffersLoading,
      sentOffersRefetch,
      receivedOffers,
      transactions,
      acceptOffer,
      sentOffers,
    }
  }
