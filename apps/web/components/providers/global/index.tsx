import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from 'react'
import { globalReducer } from './reducer'
import { GlobalActionTypes, GlobalState, initialState } from './utils'

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
