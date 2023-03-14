import { CryptoHookFactory } from '@_types/hooks'

type UseNftOffersResponse = {
  // makeOffer: (_tokenId: number, offer: string) => Promise<void>
}

type NftOffersHookFactory = CryptoHookFactory<UseNftOffersResponse>

export type UseNftOffersHook = ReturnType<NftOffersHookFactory>

export const hookFactory: NftOffersHookFactory =
  ({}) =>
  () => {
    return {
      // makeOffer,
    }
  }
