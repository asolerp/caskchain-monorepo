import { LoadingContext } from 'components/contexts/LoadingContext'
import { useContext, useEffect, useState } from 'react'

const useLocalLoading = () => {
  const { isLoading } = useContext(LoadingContext)
  const [localLoading, setLocalLoading] = useState(true)

  useEffect(() => {
    if (isLoading) {
      setLocalLoading(true)
    } else {
      setTimeout(() => {
        setLocalLoading(false)
      }, 2000)
    }
  }, [isLoading])

  return {
    loading: localLoading,
  }
}

export default useLocalLoading
