import { useGlobal } from '@providers/global'
import { LoadingAnimation } from '@ui/common/Loading/LoadingAnimation'
import React from 'react'

type LoadingWrapperProps = {
  children: React.ReactNode
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ children }) => {
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
