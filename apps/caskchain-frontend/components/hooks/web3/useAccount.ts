import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'

import { getCustomToken } from 'pages/api/utils'

import { connectWithMagic } from 'caskchain-lib'
import { magic } from 'lib/magic'
import { useState } from 'react'
import { signInUser } from 'lib/firebase/firebase'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from 'components/contexts/AuthContext'
import { getUserData } from 'pages/api/auth/getUserData'
import { useWeb3 } from 'caskchain-lib/provider/web3'
import { getCookie, setCookie } from 'cookies-next'

export const useAccount = () => {
  const { web3, setIsConnected } = useWeb3()
  const token = getCookie('token')
  const {
    state: { address },
    dispatch,
  } = useGlobal()

  const { data } = useQuery({
    queryKey: ['getUserData', address],
    queryFn: () => getUserData(address as string),
    staleTime: 5 * 1000,
  })

  const [loading, setLoading] = useState<boolean>(false)

  const checkIfUserDataIsNeeded = async (callback?: any) => {
    const user = data?.user

    if (!token) {
      return dispatch({
        type: GlobalTypes.SET_SIGN_IN_MODAL,
        payload: { status: true },
      })
    }
    if (!user?.email) {
      return dispatch({
        type: GlobalTypes.SET_USER_INFO_MODAL,
        payload: { status: true },
      })
    }
    if (callback) {
      callback()
    }
  }

  const signAddress = async ({
    callback = () => null,
  }: {
    callback?: () => void
  }) => {
    try {
      setLoading(true)
      const customToken = await getCustomToken(web3, address)

      if (!customToken) {
        throw new Error('Invalid JWT')
      }

      const signedUser = await signInUser(customToken)
      const user: any = signedUser?.user
      setCookie('token', user?.accessToken)
      callback && callback()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenSidebar = (status: boolean) => {
    checkIfUserDataIsNeeded(() => {
      dispatch({
        type: GlobalTypes.SET_SIDE_BAR,
        payload: { status: !status },
      })
    })
  }

  const connect = async () => {
    setLoading(true)
    try {
      const accounts = await connectWithMagic(magic)
      localStorage.setItem('user', accounts[0])
      dispatch({
        type: GlobalTypes.SET_ADDRESS,
        payload: { address: accounts[0] },
      })
      setIsConnected(true)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return {
    connect,
    loading,
    signAddress,
    data: address,
    handleOpenSidebar,
    user: data?.user,
    checkIfUserDataIsNeeded,
  }
}
