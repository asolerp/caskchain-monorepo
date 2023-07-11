import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'
import { CryptoHookFactory } from '@_types/hooks'
import axios from 'axios'
import { getCookie, setCookie } from 'cookies-next'

import { getSignedData } from 'pages/api/utils'

import { connectWithMagic, getWeb3 } from 'caskchain-lib'
import { magic } from 'lib/magic'
import { useState } from 'react'

type AccountHookFactory = CryptoHookFactory<string, any>

export type UseAccountHook = ReturnType<AccountHookFactory>

export const hookFactory: AccountHookFactory =
  ({ web3, setWeb3 }) =>
  () => {
    const {
      state: { user, address },
      dispatch,
    } = useGlobal()

    const [loading, setLoading] = useState<boolean>(false)
    const token = getCookie('token')

    // const [erc20Balances, setERC20Balances] = useState()

    // const erc20Balance = useCallback(async () => {
    //   const Tether = await loadContractByABI(
    //     MocksUSDTContract.networks[4447].address,
    //     MocksUSDTContract.abi
    //   )
    //   return await Tether.balanceOf(address)
    // }, [])

    const signAddress = async ({ callback }: { callback: () => void }) => {
      try {
        const signedMessage = await getSignedData(web3, address)
        const responseSign = await axios.post(
          `/api/user/${address}/signature`,
          { ...signedMessage, address }
        )
        setCookie('token', responseSign.data?.token)
        setCookie('refresh-token', responseSign.data?.refreshToken)

        callback()
      } catch (e) {
        console.error(e)
      }
    }

    const connect = async () => {
      setLoading(true)
      try {
        const accounts = await connectWithMagic(magic)

        console.log('Logged in user:', accounts[0])
        localStorage.setItem('user', accounts[0])

        // Once user is logged in, re-initialize web3 instance to use the new provider (if connected with third party wallet)
        const web3 = await getWeb3(magic)
        setWeb3(web3)
        dispatch({
          type: GlobalTypes.SET_ADDRESS,
          payload: { address: accounts[0] },
        })
        const userDB = await axios.get(`/api/user/${accounts[0].toLowerCase()}`)

        const { email } = userDB?.data
        if (!email) {
          dispatch({
            type: GlobalTypes.SET_USER_INFO_MODAL,
            payload: { status: true },
          })
        } else {
          dispatch({
            type: GlobalTypes.SET_USER,
            payload: { user: userDB?.data },
          })
        }
        if (!token) {
          return dispatch({
            type: GlobalTypes.SET_SIGN_IN_MODAL,
            payload: { status: true },
          })
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    // const connect = async () => {
    //   if (!user?.email) {
    //     return dispatch({
    //       type: GlobalTypes.SET_USER_INFO_MODAL,
    //       payload: { status: true },
    //     })
    //   }
    //   if (!token) {
    //     return dispatch({
    //       type: GlobalTypes.SET_SIGN_IN_MODAL,
    //       payload: { status: true },
    //     })
    //   }
    // }

    return {
      connect,
      loading,
      signAddress,
      data: user?.address,
      // erc20Balances,
    }
  }
