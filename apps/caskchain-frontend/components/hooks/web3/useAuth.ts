import { useGlobal } from '@providers/global'

import axiosClient from 'lib/fetcher/axiosInstance'

export const useAuth = () => {
  const {
    state: { address },
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
