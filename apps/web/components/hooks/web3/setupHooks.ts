import { Web3Dependencies } from '@_types/hooks'
import { hookFactory as createAccountHook, UseAccountHook } from './useAccount'
import { hookFactory as createNetworkHook, UseNetworkHook } from './useNetwork'
import {
  hookFactory as createListedNftsHook,
  UseListedNftsHook,
} from './useListedNfts'
import {
  hookFactory as createNftOffersHook,
  UseNftOffersHook,
} from './useNftOffers'
import { hookFactory as createAllNftsHook, UseAllNftsHook } from './useAllNfts'
import {
  hookFactory as createOwnedNftsHook,
  UseOwnedNftsHook,
} from './useOwnedNfts'

import { hookFactory as createCaskHook, UseCaskNftsHook } from './useCaskNft'

import {
  hookFactory as createFractionalizedNftsHook,
  UseFractionalizedNftsHook,
} from './useFractionalizedNfts'

export type Web3Hooks = {
  useAccount: UseAccountHook
  useCask: UseCaskNftsHook
  useNetwork: UseNetworkHook
  useNftOffers: UseNftOffersHook
  useListedNfts: UseListedNftsHook
  useAllNfts: UseAllNftsHook
  useOwnedNfts: UseOwnedNftsHook
  useFractionalizedNfts: UseFractionalizedNftsHook
}

export type SetupHooks = {
  (d: Web3Dependencies): Web3Hooks
}

export const setupHooks: SetupHooks = (deps) => {
  return {
    useAccount: createAccountHook(deps),
    useCask: createCaskHook(deps),
    useNetwork: createNetworkHook(deps),
    useListedNfts: createListedNftsHook(deps),
    useOwnedNfts: createOwnedNftsHook(deps),
    useNftOffers: createNftOffersHook(deps),
    useAllNfts: createAllNftsHook(deps),
    useFractionalizedNfts: createFractionalizedNftsHook(deps),
  }
}
