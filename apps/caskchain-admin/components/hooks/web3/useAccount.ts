import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'

import axios from 'axios'
import { getCookie, setCookie } from 'cookies-next'

import { getSignedData } from 'pages/api/utils'

import { useRouter } from 'next/router'

import { connectWithMagic } from 'caskchain-lib'

import { toast } from 'react-toastify'
import { magic } from 'lib/magic'
import { useWeb3 } from 'caskchain-lib/provider/web3'

export const useAccount = () => {
  const {
    state: { user, address },
    dispatch,
  } = useGlobal()

  const { web3, setIsConnected } = useWeb3()
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
      setIsConnected(true)
      const userDB = await axios.get(`/api/user/${accounts[0].toLowerCase()}`)
      dispatch({
        type: GlobalTypes.SET_USER,
        payload: { user: userDB?.data },
      })
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
