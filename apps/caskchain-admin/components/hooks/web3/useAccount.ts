import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'

import axios from 'axios'
import { getCookie, setCookie } from 'cookies-next'

import { getCustomToken } from 'pages/api/utils'

import { connectWithMagic } from 'caskchain-lib'

// import { toast } from 'react-toastify'
import { magic } from 'lib/magic'
import { useWeb3 } from 'caskchain-lib/provider/web3'
import { signInUser } from 'lib/firebase/firebase'
import { useRouter } from 'next/router'

export const useAccount = () => {
  const {
    state: { user, address },
    dispatch,
  } = useGlobal()

  const router = useRouter()
  const { web3, setIsConnected } = useWeb3()
  const token = getCookie('token')

  const signAddress = async ({
    address,
    callback = () => null,
  }: {
    address: string
    callback?: (user: any) => void
  }) => {
    try {
      const customToken = await getCustomToken(web3, address)

      if (!customToken) {
        throw new Error('Invalid JWT')
      }

      const signedUser = await signInUser(customToken)
      const user: any = signedUser?.user

      callback && callback(user)
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
    try {
      const accounts = await connectWithMagic(magic)
      localStorage.setItem('user', accounts[0])
      dispatch({
        type: GlobalTypes.SET_ADDRESS,
        payload: { address: accounts[0] },
      })
      setIsConnected(true)
      signAddress({
        address: accounts[0],
        callback: (user) => {
          setCookie('token', user?.accessToken)
          router.push('/dashboard')
        },
      })
    } catch (error) {
      console.error(error)
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
