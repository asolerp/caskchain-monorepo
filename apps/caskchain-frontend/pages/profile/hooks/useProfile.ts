import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'

import { toast } from 'react-toastify'
import { useQueryClient } from '@tanstack/react-query'

import { useMutation } from '@tanstack/react-query'
import { updateUser } from 'pages/api/user/updateUser'

const useProfile = () => {
  const {
    state: { address },
    dispatch,
  } = useGlobal()

  const queryClient = useQueryClient()

  const { mutate, status } = useMutation({
    mutationKey: ['updateUser'],
    mutationFn: (data: any) => updateUser(address as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getUserData', address] })
    },
  })

  const handleSaveUser = async ({ formState }: any) => {
    try {
      mutate(formState)
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
    mutate({
      shippingInfo: {
        ...formState,
      },
    })
    toast.success('Your shipping information has been updated!', {
      theme: 'dark',
    })
  }

  const handleSaveBackupInfo = async ({ formState }: any) => {
    mutate({
      backupInfo: {
        ...formState,
      },
    })
    toast.success('Your backup information has been updated!', {
      theme: 'dark',
    })
  }

  return {
    handleSaveUser,
    loading: status === 'pending',
    handleSaveBackupInfo,
    handleSaveShippingInfo,
  }
}

export default useProfile
