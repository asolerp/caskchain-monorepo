import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'
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
    dispatch,
  } = useGlobal()

  const refetchUser = async () => {
    const user = await axiosClient
      .get(`/api/user/${address?.toLowerCase()}`)
      .then((res: any) => res.data)
    if (user) {
      dispatch({
        type: GlobalTypes.SET_USER,
        payload: { user },
      })
    }
  }

  return {
    refetchUser,
  }
}
