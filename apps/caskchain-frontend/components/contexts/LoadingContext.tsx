import React, { createContext, useState } from 'react'

interface LoadingContextProps {
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

type LoadingProviderProps = {
  children: React.ReactNode
}

export const LoadingContext = createContext<LoadingContextProps>({
  isLoading: true,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsLoading: () => {},
})

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}
