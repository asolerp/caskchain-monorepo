import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'
import { useEffect } from 'react'

const useLoading = ({ loading }: { loading: boolean }) => {
  const { dispatch } = useGlobal()

  useEffect(() => {
    console.log('loading', loading)
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
  }, [loading])
}

export default useLoading
