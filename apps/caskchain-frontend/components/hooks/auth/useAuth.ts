import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'
import { GeneralHookFactory } from '@_types/hooks'

import axiosClient from 'lib/fetcher/axiosInstance'
import { useEffect } from 'react'
import useSWR from 'swr'
import { useAccount } from 'wagmi'

type UseAuthResponse = {
  refetchUser: () => Promise<any>
}

type AuthHookFactory = GeneralHookFactory<UseAuthResponse>

export type UseAuthHook = ReturnType<AuthHookFactory>

export const hookFactory: AuthHookFactory = () => () => {
  const { address } = useAccount()
  const { dispatch } = useGlobal()

  const { data: user, mutate: refetchUser } = useSWR(
    address ? `/api/user/${address.toLowerCase()}` : null,
    async (url: string) => {
      return axiosClient.get(url).then((res: any) => res.data)
    },
    {
      revalidateOnFocus: false,
    }
  )

  useEffect(() => {
    if (user) {
      dispatch({
        type: GlobalTypes.SET_USER,
        payload: { user: { ...user, address } },
      })
    }
  }, [user, dispatch, address])

  return {
    refetchUser,
  }
}
