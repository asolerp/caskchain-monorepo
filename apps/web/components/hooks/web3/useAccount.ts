import { Web3Provider } from '@ethersproject/providers'
import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'
import { CryptoHookFactory } from '@_types/hooks'
import axios from 'axios'
import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import axiosClient from 'lib/fetcher/axiosInstance'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import { getSignedData } from 'pages/api/utils'
import { useEffect } from 'react'
import useSWR from 'swr'
import { ethers } from 'ethers'

type UseAccountResponse = {
  connect: () => void
  multiConnect: () => void
  logout: () => void
  signAddress: ({ callback }: { callback: () => void }) => void
  handelSaveUser: ({
    id,
    email,
    nickname,
    callback,
  }: {
    id: string
    email: string
    nickname: string
    callback: () => void
  }) => void
  isValidating: boolean
  isLoading: boolean
  isInstalled: boolean
  hasAllAuthData: boolean
}

type AccountHookFactory = CryptoHookFactory<string, UseAccountResponse>

export type UseAccountHook = ReturnType<AccountHookFactory>

export const hookFactory: AccountHookFactory =
  ({ provider, ethereum, isLoading }) =>
  () => {
    const {
      state: { user },
      dispatch,
    } = useGlobal()
    const token = getCookie('token')
    const Router = useRouter()

    const providerOptions = {}

    const { data, mutate, isValidating, ...swr } = useSWR(
      provider ? 'web3/useAccount' : null,
      async () => {
        const accounts = await provider!.listAccounts()
        const account = accounts[0]

        if (!account) {
          throw 'Cannot retreive account! Pelase, connect to web3 wallet.'
        }

        return account
      },
      {
        revalidateOnFocus: false,
        shouldRetryOnError: false,
      }
    )

    useEffect(() => {
      ethereum?.on('accountsChanged', handleAccountsChange)
      return () => {
        ethereum?.removeListener('accountsChanged', handleAccountsChange)
      }
    })

    const handleAccountsChange = (...args: unknown[]) => {
      const accounts = args[0] as string[]
      if (accounts.length === 0) {
        window.location.reload()
        console.error('Please, connect to Web3 wallet')
      } else if (accounts[0] !== data) {
        mutate(accounts[0])
      }
    }

    const signAddress = async ({ callback }: { callback: () => void }) => {
      try {
        const signedMessage = await getSignedData(
          provider as Web3Provider,
          data as string
        )
        const responseSign = await axios.post(
          `/api/user/${data}/signature`,
          signedMessage
        )
        setCookie('token', responseSign.data?.token)
        setCookie('refresh-token', responseSign.data?.refreshToken)

        callback()
      } catch (e) {
        console.error(e)
      }
    }

    const handelSaveUser = async ({
      id,
      email,
      nickname,
      callback,
    }: {
      id: string
      email: string
      nickname: string
      callback: () => void
    }) => {
      try {
        await axios.post('/api/user', {
          id,
          email,
          nickname,
        })
        dispatch({
          type: GlobalTypes.SET_USER,
          payload: { user: { _id: id, email, nickname, address: data } },
        })
        callback()
      } catch (e: any) {
        console.log(e)
      }
    }

    const multiConnect = async () => {
      try {
        const web3Modal = new Web3Modal({
          cacheProvider: false,
          providerOptions,
        })
        const web3ModalInstance = await web3Modal.connect()
        const web3ModalProvider = new ethers.providers.Web3Provider(
          web3ModalInstance
        )
        console.log(web3ModalProvider)
      } catch (e) {
        console.log(e)
      }
    }

    const connect = async () => {
      if (!data) {
        return await ethereum?.request({
          method: 'eth_requestAccounts',
        })
      }
      if (!user?.email) {
        return dispatch({
          type: GlobalTypes.SET_USER_INFO_MODAL,
          payload: { state: true },
        })
      }
      if (!token) {
        return dispatch({
          type: GlobalTypes.SET_SIGN_IN_MODAL,
          payload: { state: true },
        })
      }
    }

    const logout = async () => {
      deleteCookie('token')
      deleteCookie('refresh-token')
      dispatch({
        type: GlobalTypes.SET_USER,
        payload: { user: null },
      })
      await axiosClient.get(`/api/user/${data}/cleanTokens`)
      Router.push('/')
    }

    return {
      data,
      ...swr,
      mutate,
      logout,
      connect,
      signAddress,
      multiConnect,
      isValidating,
      handelSaveUser,
      hasAllAuthData: token && user,
      isLoading: isLoading as boolean,
      isInstalled: ethereum?.isMetaMask || false,
    }
  }
