import { useGlobal } from '@providers/global'

import { CryptoHandlerHook } from '@_types/hooks'

import axiosClient from 'lib/fetcher/axiosInstance'

type UseAuthResponse = {
  refetchUser: () => Promise<any>
}

type AuthHookFactory = CryptoHandlerHook<UseAuthResponse>
export type UseAuthHook = ReturnType<AuthHookFactory>

export const hookFactory: AuthHookFactory = () => () => {
  const {
    state: { address },
    // dispatch,
  } = useGlobal()

  const refetchUser = async ({ callback }: any) => {
    const user = await axiosClient
      .get(`/api/user/${address?.toLowerCase()}`)
      .then((res: any) => res.data)
    if (user) {
      callback && callback(user)
    }
  }

  return {
    refetchUser,
  }
}
