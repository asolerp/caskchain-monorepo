import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  createDefaultState,
  createWeb3State,
  loadContract,
  loadContractByAddress,
  Web3State,
} from './utils'
import { ethers } from 'ethers'

import { MetaMaskInpageProvider } from '@metamask/providers'
import { CcNftContract } from '@_types/ccNftContract'
import { NftVendorContract } from '@_types/nftVendorContract'
import { NftOffersContract } from '@_types/nftOffersContract'
import { useRouter } from 'next/router'
import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'
import axiosClient from 'lib/fetcher/axiosInstance'
// import { NftFractionsVendorContract } from '@_types/nftFractionsVendorContract'
import { NftFractionsFactoryContract } from '@_types/nftFractionsFactoryContract'

const pageReload = () => {
  window.location.reload()
}

const accountChanged = (logout: any) => {
  logout()
  window.location.reload()
}

const setGlobalListeners = (ethereum: MetaMaskInpageProvider, logout: any) => {
  ethereum.on('chainChanged', pageReload)
  ethereum.on('accountsChanged', () => accountChanged(logout))
  ethereum.on('disconnect', pageReload)
}

const removeGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
  ethereum?.removeListener('chainChanged', pageReload)
  ethereum?.removeListener('accountsChnaged', pageReload)
  ethereum?.removeListener('disconnect', pageReload)
}

const Web3Context = createContext<Web3State>(createDefaultState())

interface Props {
  children: ReactNode
}

const Web3Provider: React.FC<Props> = ({ children }) => {
  const Router = useRouter()
  const { dispatch } = useGlobal()
  const [web3Api, setWeb3Api] = useState<Web3State>(createDefaultState())

  const logout = async () => {
    console.log('Login out')
    localStorage.removeItem('token')
    localStorage.removeItem('refresh-token')
    dispatch({
      type: GlobalTypes.SET_TOKEN,
      payload: { token: null },
    })
    dispatch({
      type: GlobalTypes.SET_USER,
      payload: { user: null },
    })

    const accounts = await web3Api.provider?.listAccounts()
    const account = accounts?.[0]

    await axiosClient.get(`/api/user/${account}/cleanTokens`)
    Router.push('/')
  }

  useEffect(() => {
    async function initWeb3() {
      console.log('INIT WEB3')
      try {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum as any
        )
        const ccNft = await loadContract('CCNft', provider)
        const nftVendor = await loadContract('NftVendor', provider)
        const nftOffers = await loadContract('NftOffers', provider)

        const nftFractionsFactory = await loadContract(
          'NftFractionsFactory',
          provider
        )
        const nftFractionsVendor = await loadContract(
          'NftFractionsVendor',
          provider
        )

        const nftFactionToken = async (address: string) =>
          await loadContractByAddress('NftFractionToken', provider, address)

        const signer = provider.getSigner()

        const sigendNftVendorContract = nftVendor.connect(signer)
        const signedCCNftContract = ccNft.connect(signer)
        const signedNftOffersContract = nftOffers.connect(signer)
        const signednftFractionsVendor = nftFractionsVendor.connect(signer)
        const signednftFractionsFactory = nftFractionsFactory.connect(signer)
        const signedNftFractionToken = async (address: string) =>
          (await nftFactionToken(address)).connect(signer)

        // const signedNftFractionToken = async (tokenAddress: string) => {
        //   console.log('HOLA FROM SIGNED NFT FRACTION TOKEN')
        //   const res = await fetch(`/contracts/NftFractionToken.json`)
        //   const Contract = await res.json()

        //   const TokenContract = new ethers.Contract(
        //     tokenAddress,
        //     Contract.abi,
        //     provider
        //   )

        //   const _signedTokenContract = TokenContract.connect(signer)
        //   console.log(_signedTokenContract, 'signedTokenContract')
        //   return _signedTokenContract
        // }

        setGlobalListeners(window.ethereum, logout)
        setWeb3Api(
          createWeb3State({
            ethereum: window.ethereum,
            provider,
            // erc20Contracts: { [usdtERC20.address]: sigendNftVendorContract },
            nftFractionToken: signedNftFractionToken,
            nftFractionsVendor: signednftFractionsVendor as unknown as any,
            nftFractionsFactory:
              signednftFractionsFactory as unknown as NftFractionsFactoryContract,
            ccNft: signedCCNftContract as unknown as CcNftContract,
            nftVendor: sigendNftVendorContract as unknown as NftVendorContract,
            nftOffers: signedNftOffersContract as unknown as NftOffersContract,
            isLoading: false,
          })
        )
      } catch (e: any) {
        console.error('ERROR', e.message)
        setWeb3Api((api) =>
          createWeb3State({
            ...(api as any),
            isLoading: false,
          })
        )
      }
    }
    initWeb3()
    return () => removeGlobalListeners(window.ethereum)
  }, [])

  return <Web3Context.Provider value={web3Api}>{children}</Web3Context.Provider>
}

export function useWeb3() {
  return useContext(Web3Context)
}

export function useHooks() {
  const { hooks } = useWeb3()
  return hooks
}

export default Web3Provider
