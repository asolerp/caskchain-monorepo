import React from 'react'

type LoadingWrapperProps = {
  children: React.ReactNode
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ children }) => {
  return <>{children}</>
}

export default LoadingWrapper
