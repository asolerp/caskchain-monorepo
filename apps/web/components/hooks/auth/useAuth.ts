import { useAccount } from '@hooks/web3'
import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'
import { GeneralHookFactory } from '@_types/hooks'

import axiosClient from 'lib/fetcher/axiosInstance'
import { useEffect } from 'react'
import useSWR from 'swr'

type UseAuthResponse = void

type AuthHookFactory = GeneralHookFactory<UseAuthResponse>

export type UseAuthHook = ReturnType<AuthHookFactory>

export const hookFactory: AuthHookFactory = () => () => {
  const {
    account: { data },
  } = useAccount()
  const { dispatch } = useGlobal()

  const { data: user } = useSWR(
    data ? `/api/user/${data.toLowerCase()}` : null,
    async (url: string) => {
      return axiosClient.get(url).then((res: any) => res.data)
    }
  )

  useEffect(() => {
    const token = localStorage.getItem('token')
    dispatch({
      type: GlobalTypes.SET_TOKEN,
      payload: { token },
    })
  }, [dispatch])

  useEffect(() => {
    if (data && user) {
      dispatch({
        type: GlobalTypes.SET_USER,
        payload: { user: { ...user, address: data } },
      })
    }
  }, [user, dispatch, data])
}
