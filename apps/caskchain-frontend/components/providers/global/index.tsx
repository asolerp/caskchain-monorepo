import { Router } from 'next/router'
import {
  createContext,
  Dispatch,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { globalReducer } from './reducer'
import { useQuery } from '@tanstack/react-query'

import {
  GlobalActionTypes,
  GlobalState,
  GlobalTypes,
  initialState,
} from './utils'
import { getMagicProvider } from 'caskchain-lib'

import axiosClient from 'lib/fetcher/axiosInstance'

import { logout } from 'caskchain-lib/utils'

import { useWeb3Instance } from 'caskchain-lib/provider/web3'
import { magic } from 'lib/magic'
import { getUserData } from 'pages/api/auth/getUserData'

const GlobalContext = createContext<{
  state: GlobalState
  dispatch: Dispatch<GlobalActionTypes>
}>({
  state: initialState,
  dispatch: () => null,
})

interface Props {
  children: ReactNode
}

const GlobalProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null)
  const [state, dispatch] = useReducer(globalReducer, initialState)

  const { data, refetch } = useQuery({
    queryKey: ['getUserData', user],
    queryFn: () => getUserData(user as string),
    staleTime: 5 * 1000,
  })

  // const { setWeb3 } = useWeb3Instance()

  const handleUserOnPageLoad = async () => {
    const userLocal = localStorage.getItem('user')
    if (userLocal) {
      setUser(userLocal)
      dispatch({
        type: GlobalTypes.SET_ADDRESS,
        payload: { address: userLocal },
      })
      refetch()
    }
  }

  const handleRouteChange = useCallback(() => {
    if (state.sideBar)
      dispatch({ type: GlobalTypes.SET_SIDE_BAR, payload: { status: false } })
  }, [state])

  useEffect(() => {
    if (state.sideBar) {
      document.body.style.overflowY = 'hidden'
    } else {
      document.body.style.overflowY = 'auto'
    }
  }, [state.sideBar])

  useEffect(() => {
    // We listen to this event to determine whether to redirect or not
    Router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      Router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [handleRouteChange])

  useEffect(() => {
    handleUserOnPageLoad()
  }, [])

  useEffect(() => {
    if (data) {
      dispatch({
        type: GlobalTypes.SET_USER,
        payload: { user: data.user },
      })
    }
  }, [data])

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  )
}

export function useGlobal() {
  return useContext(GlobalContext)
}

export default GlobalProvider
