import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'
import { CryptoHookFactory } from '@_types/hooks'
import axios from 'axios'
import { getCookie, setCookie } from 'cookies-next'

import { getSignedData } from 'pages/api/utils'

import { useRouter } from 'next/router'

import { getWeb3, connectWithMagic } from 'caskchain-lib'

import { toast } from 'react-toastify'
import { useWeb3Instance } from 'caskchain-lib/provider/web3'
import { magic } from 'lib/magic'

type AccountHookFactory = CryptoHookFactory<string, any>

export type UseAccountHook = ReturnType<AccountHookFactory>

export const hookFactory: AccountHookFactory = () => () => {
  const {
    state: { user, address },
    dispatch,
  } = useGlobal()
  const { web3, setWeb3 } = useWeb3Instance()
  const token = getCookie('token')
  const router = useRouter()

  const signAddress = async (address: string, callback: any) => {
    try {
      const signedMessage = await getSignedData(web3, address as string)
      const responseSign = await axios.post(`/api/user/${address}/signature`, {
        ...signedMessage,
        address,
      })
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

  const connect = async () => {
    const accounts = await connectWithMagic(magic)

    if (accounts) {
      localStorage.setItem('user', accounts[0])
      const web3 = await getWeb3(magic)
      setWeb3(web3)
      dispatch({
        type: GlobalTypes.SET_ADDRESS,
        payload: { address: accounts[0] },
      })
      signAddress(accounts[0], () => router.push('/dashboard'))
    } else {
      toast.error('Please connect your wallet')
    }
  }

  return {
    data: address,
    connect,
    signAddress,
    handelSaveUser,
    hasAllAuthData: token && user,
  }
}
