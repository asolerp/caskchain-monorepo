import { LoadingAnimation } from '@ui/common/Loading/LoadingAnimation'
import { LoadingContext } from 'components/contexts/LoadingContext'
import React, { useContext, useEffect } from 'react'

const LoadingOverlay: React.FC = () => {
  const { isLoading } = useContext(LoadingContext)
  const [localLoading, setLocalLoading] = React.useState(true)

  useEffect(() => {
    if (isLoading) {
      setLocalLoading(true)
    } else {
      setTimeout(() => {
        setLocalLoading(false)
      }, 2000)
    }
  }, [isLoading])

  if (localLoading) {
    return <LoadingAnimation />
  }

  return null
}

export default LoadingOverlay
