import { LoadingContext } from 'components/contexts/LoadingContext'
import { useContext, useEffect, useState } from 'react'

const useLocalLoading = () => {
  const { isLoading, setIsLoading } = useContext(LoadingContext)
  const [localLoading, setLocalLoading] = useState(true)

  console.log('isLoading', isLoading)

  useEffect(() => {
    if (isLoading) {
      setLocalLoading(true)
    } else {
      setTimeout(() => {
        setIsLoading(false)
        setLocalLoading(false)
      }, 2000)
    }
  }, [isLoading, setIsLoading])

  return {
    loading: localLoading,
  }
}

export default useLocalLoading
