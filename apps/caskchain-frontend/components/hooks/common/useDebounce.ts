import { useEffect, useRef } from 'react'

type UseDebounceProps = (callback: () => void, delay: number) => () => void

const useDebounce: UseDebounceProps = (callback, delay) => {
  const latestCallback = useRef<any>()
  const latestTimeout = useRef<any>()

  useEffect(() => {
    latestCallback.current = callback
  }, [callback])

  return () => {
    if (latestTimeout.current) {
      clearTimeout(latestTimeout.current)
    }

    latestTimeout.current = setTimeout(() => {
      latestCallback.current()
    }, delay)
  }
}

export default useDebounce
