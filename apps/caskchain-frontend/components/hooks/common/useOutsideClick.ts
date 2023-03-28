import { useEffect, useRef } from 'react'

const useOutsideClick = (callback: any) => {
  const ref = useRef<any>()

  useEffect(() => {
    const handleClick = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback && callback()
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return ref
}

export default useOutsideClick
