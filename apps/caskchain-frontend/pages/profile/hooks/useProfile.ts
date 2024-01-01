import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'
import axios from 'axios'
import { toast } from 'react-toastify'
import useSWRMutation from 'swr/mutation'

async function updateUserData(url: string, { arg }: { arg: any }) {
  return axios.post(url, arg)
}

const useProfile = () => {
  const {
    state: { address, user },
    dispatch,
  } = useGlobal()

  const { trigger, isMutating } = useSWRMutation(
    '/api/user',
    updateUserData /* options */
  )

  const handleSaveUser = async ({ formState }: any) => {
    try {
      trigger({
        id: address?.toLowerCase(),
        firstName: formState.firstName,
        lastName: formState.lastName,
        dateOfBirth: formState.dateOfBirth,
        email: formState.email,
        nickname: formState.nickname,
        country: formState.country,
      })
      dispatch({
        type: GlobalTypes.SET_USER,
        payload: { user: { ...formState } },
      })
      toast.success('Your profile has been updated!', {
        theme: 'dark',
      })
    } catch (e: any) {
      toast.error('Something went wrong', {
        theme: 'dark',
      })
      console.log(e)
    }
  }

  const handleSaveShippingInfo = async ({ formState }: any) => {
    trigger({
      id: address?.toLowerCase(),
      shippingInfo: {
        ...formState,
      },
    })
    dispatch({
      type: GlobalTypes.SET_USER,
      payload: { user: { ...user, shippingInfo: formState } },
    })
    toast.success('Your shipping information has been updated!', {
      theme: 'dark',
    })
  }

  const handleSaveBackupInfo = async ({ formState }: any) => {
    trigger({
      id: address?.toLowerCase(),
      backupInfo: {
        ...formState,
      },
    })
    dispatch({
      type: GlobalTypes.SET_USER,
      payload: { user: { ...user, backupInfo: formState } },
    })
    toast.success('Your backup information has been updated!', {
      theme: 'dark',
    })
  }

  return {
    handleSaveUser,
    loading: isMutating,
    handleSaveBackupInfo,
    handleSaveShippingInfo,
  }
}

export default useProfile
