import { Web3Dependencies } from '@_types/hooks'
import { hookFactory as createAccountHook, UseAccountHook } from './useAccount'
import { hookFactory as createNetworkHook, UseNetworkHook } from './useNetwork'
import {
  hookFactory as createMyActivityHook,
  UseMyActivityHook,
} from './useMyActivity'

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
import { hookFactory as createSideBarHook, UseSideBarHook } from './useSideBar'

import {
  hookFactory as createFractionalizedNftsHook,
  UseFractionalizedNftsHook,
} from './useFractionalizedNfts'

export type Web3Hooks = {
  useMyActivity: UseMyActivityHook
  useAccount: UseAccountHook
  useCask: UseCaskNftsHook
  useNetwork: UseNetworkHook
  useNftOffers: UseNftOffersHook
  useListedNfts: UseListedNftsHook
  useAllNfts: UseAllNftsHook
  useSideBar: UseSideBarHook
  useOwnedNfts: UseOwnedNftsHook
  useFractionalizedNfts: UseFractionalizedNftsHook
}

export type SetupHooks = {
  (d: Web3Dependencies): Web3Hooks
}

export const setupHooks: SetupHooks = (deps) => {
  return {
    useAccount: createAccountHook(deps),
    useMyActivity: createMyActivityHook(deps),
    useCask: createCaskHook(deps),
    useSideBar: createSideBarHook(deps),
    useNetwork: createNetworkHook(deps),
    useListedNfts: createListedNftsHook(deps),
    useOwnedNfts: createOwnedNftsHook(deps),
    useNftOffers: createNftOffersHook(deps),
    useAllNfts: createAllNftsHook(deps),
    useFractionalizedNfts: createFractionalizedNftsHook(deps),
  }
}
