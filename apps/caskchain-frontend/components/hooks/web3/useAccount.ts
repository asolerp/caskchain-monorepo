import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'
import { CryptoHookFactory } from '@_types/hooks'
import axios from 'axios'
import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import axiosClient from 'lib/fetcher/axiosInstance'
import MocksUSDTContract from 'contracts/build/contracts/MockUSDT.json'
import { useWeb3Modal } from '@web3modal/react'

import { getSignedData } from 'pages/api/utils'

import { useAccount, useProvider, useSigner } from 'wagmi'
import { useCallback, useEffect, useState } from 'react'
import { loadContractByABI } from '@providers/web3/utils'
import { ethers } from 'ethers'

import { Magic } from 'magic-sdk'

const customNodeOptions = {
  rpcUrl: 'http://127.0.0.1:8545', // Custom RPC URL
  chainId: 4447, // Custom chain id
}

const magic = new Magic('pk_live_D736918766116B24', {
  network: customNodeOptions,
})

type AccountHookFactory = CryptoHookFactory<string, any>

export type UseAccountHook = ReturnType<AccountHookFactory>

export const hookFactory: AccountHookFactory = () => () => {
  const {
    state: { user },
    dispatch,
  } = useGlobal()
  const token = getCookie('token')
  const { address, isConnected } = useAccount()
  const provider = useProvider()
  const { data: signer } = useSigner()
  const [erc20Balances, setERC20Balances] = useState()

  const { open } = useWeb3Modal()

  const erc20Balance = useCallback(async () => {
    const Tether = await loadContractByABI(
      MocksUSDTContract.networks[80001].address,
      MocksUSDTContract.abi
    )
    return await Tether.balanceOf(address)
  }, [address])

  useEffect(() => {
    const getBalance = async () => {
      const balance = await erc20Balance()
      setERC20Balances((prev: any) => ({
        ...prev,
        usdt: ethers.utils.formatEther(balance.toString()),
      }))
    }
    if (provider && address && isConnected) {
      if (
        String(provider._network.chainId) ===
        (process.env.NEXT_PUBLIC_NETWORK_ID as string)
      ) {
        getBalance()
      }
    }
  }, [provider, address, isConnected])

  const signAddress = async ({ callback }: { callback: () => void }) => {
    try {
      const signedMessage = await getSignedData(signer, address as string)
      const responseSign = await axios.post(
        `/api/user/${address}/signature`,
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
    await magic.auth.loginWithEmailOTP({ email: 'albertosolpal@gmail.com' })
    // if (!isConnected) {
    //   return open()
    // }
    // if (!user?.email) {
    //   return dispatch({
    //     type: GlobalTypes.SET_USER_INFO_MODAL,
    //     payload: { status: true },
    //   })
    // }
    // if (!token) {
    //   return dispatch({
    //     type: GlobalTypes.SET_SIGN_IN_MODAL,
    //     payload: { status: true },
    //   })
    // }
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
    erc20Balances,
    hasAllAuthData: token && user,
    isInstalled: provider !== null,
    isConnected,
  }
}
