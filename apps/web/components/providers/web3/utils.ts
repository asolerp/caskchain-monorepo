import { setupHooks, Web3Hooks } from '@hooks/web3/setupHooks'
import { MetaMaskInpageProvider } from '@metamask/providers'
import { Web3Dependencies } from '@_types/hooks'
import { Contract, ethers, providers } from 'ethers'

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider
  }
}

export type Web3Params = {
  ethereum: MetaMaskInpageProvider | null
  provider: providers.Web3Provider | null
  contract: Contract | null
}

type Nullable<T> = {
  [P in keyof T]: T[P] | null
}

export type Web3State = {
  isLoading: boolean
  hooks: Web3Hooks
} & Nullable<Web3Dependencies>

export const createDefaultState = () => {
  return {
    nftFractionsFactory: null,
    nftFractionsVendor: null,
    nftFractionToken: null,
    ethereum: null,
    provider: null,
    ccNft: null,
    nftVendor: null,
    isLoading: true,
    erc20Contracts: null,
    hooks: setupHooks({ isLoading: true } as any),
  }
}

export const createWeb3State = ({
  ethereum,
  nftFractionsFactory,
  nftFractionsVendor,
  nftFractionToken,
  provider,
  ccNft,
  nftVendor,
  erc20Contracts,
  nftOffers,
  isLoading,
}: Web3Dependencies) => {
  return {
    ethereum,
    provider,
    ccNft,
    nftVendor,
    isLoading,
    nftOffers,
    nftFractionToken,
    nftFractionsVendor,
    nftFractionsFactory,
    erc20Contracts,
    hooks: setupHooks({
      ethereum,
      provider,
      nftFractionToken,
      nftFractionsFactory,
      nftFractionsVendor,
      ccNft,
      nftVendor,
      nftOffers,
      isLoading,
      erc20Contracts,
    }),
  }
}

const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID

export const loadContractByAddress = async (
  name: string,
  provider: providers.Web3Provider,
  address: string
): Promise<Contract> => {
  if (!NETWORK_ID) {
    return Promise.reject('Network ID is not defined!')
  }

  const res = await await import(`contracts/build/contracts/${name}.json`)
  const Artifact = await res.json()

  if (address) {
    const contract = new ethers.Contract(address, Artifact.abi, provider)
    return contract
  } else {
    return Promise.reject(`Contract ${name} cannot be loaded`)
  }
}

export const loadContract = async (
  name: string,
  provider: providers.Web3Provider
): Promise<Contract> => {
  if (!NETWORK_ID) {
    return Promise.reject('Network ID is not defined!')
  }

  const res = await import(`contracts/build/contracts/${name}.json`)
  const Artifact = res

  if (Artifact.networks[NETWORK_ID].address) {
    const contract = new ethers.Contract(
      Artifact.networks[NETWORK_ID].address,
      Artifact.abi,
      provider
    )
    return contract
  } else {
    return Promise.reject(`Contract ${name} cannot be loaded`)
  }
}
