import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'
import { useEffect } from 'react'

const useLoading = ({ loading }: { loading: boolean }) => {
  const { dispatch } = useGlobal()

  useEffect(() => {
    if (loading) {
      dispatch({
        type: GlobalTypes.SET_LOADING,
        payload: { state: true },
      })
    } else {
      dispatch({
        type: GlobalTypes.SET_LOADING,
        payload: { state: false },
      })
    }
  }, [loading, dispatch])
}

export default useLoading
