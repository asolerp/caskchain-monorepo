import { GlobalActionTypes, GlobalState, GlobalTypes } from './utils'

export const globalReducer = (
  state: GlobalState,
  action: GlobalActionTypes
): GlobalState => {
  const { type } = action

  switch (type) {
    case GlobalTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload.state,
      }

    case GlobalTypes.SET_ADDRESS:
      return {
        ...state,
        address: action.payload.address,
      }

    case GlobalTypes.SET_NETWORK_MODAL:
      return {
        ...state,
        networkModal: action.payload.status,
      }

    case GlobalTypes.SET_USER:
      return {
        ...state,
        user: action.payload.user,
      }

    default:
      return state
  }
}
