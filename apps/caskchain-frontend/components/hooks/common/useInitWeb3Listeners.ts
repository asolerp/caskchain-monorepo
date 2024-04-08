import { deleteCookie } from 'cookies-next'
import { useEffect } from 'react'

const useInitWeb3Listeners = () => {
  useEffect(() => {
    const onChange = () => {
      localStorage.removeItem('user')
      deleteCookie('token')
      deleteCookie('refresh-token')
      window.location.reload()
    }

    if (typeof window.ethereum === 'undefined') return

    window.ethereum.on('accountsChanged', () => {
      onChange()
    })

    window.ethereum.on('networkChanged', () => {
      onChange()
    })

    return () => {
      window.ethereum.removeAllListeners()
    }
  }, [])
}

export default useInitWeb3Listeners
