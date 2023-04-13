import { useGlobal } from '@providers/global'
import { LoadingAnimation } from '@ui/common/Loading/LoadingAnimation'
import React from 'react'

const LoadingWrapper = ({ children }) => {
  const {
    state: { loading },
  } = useGlobal()
  return (
    <>
      {loading && <LoadingAnimation />}
      {children}
    </>
  )
}

export default LoadingWrapper
