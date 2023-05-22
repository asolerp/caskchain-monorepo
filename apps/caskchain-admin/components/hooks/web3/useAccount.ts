import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'
import { CryptoHookFactory } from '@_types/hooks'
import axios from 'axios'
import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import axiosClient from 'lib/fetcher/axiosInstance'

import { useWeb3Modal } from '@web3modal/react'

import { getSignedData } from 'pages/api/utils'

import { useAccount, useProvider, useSigner } from 'wagmi'
import { useRouter } from 'next/router'

type AccountHookFactory = CryptoHookFactory<string, any>

export type UseAccountHook = ReturnType<AccountHookFactory>

export const hookFactory: AccountHookFactory = () => () => {
  const {
    state: { user },
    dispatch,
  } = useGlobal()
  const token = getCookie('token')
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const provider = useProvider()
  const { data: signer } = useSigner()

  const { open } = useWeb3Modal()

  const signAddress = async (callback: any) => {
    try {
      const signedMessage = await getSignedData(signer, address as string)
      const responseSign = await axios.post(
        `/api/user/${address}/signature`,
        signedMessage
      )
      setCookie('token', responseSign.data?.token)
      setCookie('refresh-token', responseSign.data?.refreshToken)

      callback && callback()
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
        payload: { user: { _id: id, email, nickname, address } },
      })
      callback()
    } catch (e: any) {
      console.log(e)
    }
  }

  const multiConnect = async () => {
    try {
      open()
    } catch (e) {
      console.log(e)
    }
  }

  const connect = async () => {
    if (!isConnected) {
      return open()
    }
    signAddress(() => router.push('/dashboard'))
  }

  const logout = async () => {
    deleteCookie('token')
    deleteCookie('refresh-token')
    dispatch({
      type: GlobalTypes.SET_USER,
      payload: { user: null },
    })
    await axiosClient.get(`/api/user/${address}/cleanTokens`)
    window.location.reload()
  }

  return {
    data: address,
    logout,
    connect,
    signAddress,
    multiConnect,
    handelSaveUser,
    hasAllAuthData: token && user,
    isInstalled: provider !== null,
    isConnected,
  }
}
