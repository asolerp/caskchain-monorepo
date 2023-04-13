import { Router } from 'next/router'
import {
  createContext,
  Dispatch,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react'
import { globalReducer } from './reducer'
import {
  GlobalActionTypes,
  GlobalState,
  GlobalTypes,
  initialState,
} from './utils'

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
  const [state, dispatch] = useReducer(globalReducer, initialState)

  const handleRouteChange = useCallback(() => {
    if (state.sideBar)
      dispatch({ type: GlobalTypes.SET_SIDE_BAR, payload: { status: false } })
  }, [state])

  useEffect(() => {
    if (state.sideBar) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [state.sideBar])

  useEffect(() => {
    // We listen to this event to determine whether to redirect or not
    Router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      Router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [handleRouteChange])

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  )
}

export function useGlobal() {
  return useContext(GlobalContext)
}

export function useHooks() {
  const {
    state: { hooks },
  } = useGlobal()
  return hooks
}

export default GlobalProvider
