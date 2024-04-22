import {
  createContext,
  Dispatch,
  ReactNode,
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
import { getMagicProvider } from 'caskchain-lib'

import axiosClient from 'lib/fetcher/axiosInstance'
import { magic } from 'lib/magic'
import { logout } from 'caskchain-lib/utils'
import { useWeb3 } from 'caskchain-lib/provider/web3'

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
  const { setWeb3 } = useWeb3()

  const handleUserOnPageLoad = async () => {
    let userDB
    const provider = await getMagicProvider(magic)
    const accounts = await provider.request({ method: 'eth_accounts' })
    const user = localStorage.getItem('user')

    if (!accounts[0] && user) {
      return logout(
        setWeb3,
        () =>
          dispatch({ type: GlobalTypes.SET_USER, payload: { address: null } }),
        magic
      )
    }

    if (accounts[0]) {
      userDB = await axiosClient
        .get(`/api/user/${accounts[0]?.toLowerCase()}`)
        .then((res: any) => res.data)

      dispatch({
        type: GlobalTypes.SET_USER,
        payload: { user: { ...userDB } },
      })

      dispatch({
        type: GlobalTypes.SET_ADDRESS,
        payload: { address: user },
      })
    } else {
      dispatch({ type: GlobalTypes.SET_USER, payload: { user: null } })
      dispatch({ type: GlobalTypes.SET_ADDRESS, payload: { address: null } })
    }
  }

  useEffect(() => {
    handleUserOnPageLoad()
  }, [])

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
