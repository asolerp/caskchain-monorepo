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

    case GlobalTypes.SET_SHARE_MODAL:
      return {
        ...state,
        shareModal: action.payload.status,
      }

    case GlobalTypes.SET_INITITAL_USER_INFO:
      return {
        ...state,
        user: action.payload.user,
        address: action.payload.address,
      }

    case GlobalTypes.SET_USER_INFO_MODAL:
      return {
        ...state,
        userInfoModal: action.payload.status,
      }

    case GlobalTypes.SET_NETWORK_MODAL:
      return {
        ...state,
        networkModal: action.payload.status,
      }

    case GlobalTypes.SET_ANIMATIN_EXECUTED:
      return {
        ...state,
        animationsExecuted: {
          ...state.animationsExecuted,
          [action.payload.animation]: true,
        },
      }

    case GlobalTypes.SET_MAIN_ANIMATION_FINISHED:
      return {
        ...state,
        mainAnimationFinished: action.payload.state,
      }

    case GlobalTypes.SET_SIGN_IN_MODAL:
      return {
        ...state,
        signInModal: action.payload.status,
      }

    case GlobalTypes.SET_SIDE_BAR:
      return {
        ...state,
        sideBar: action.payload.status,
      }

    case GlobalTypes.SET_USER:
      return {
        ...state,
        user: action.payload.user,
      }

    case GlobalTypes.SET_TOKEN:
      return {
        ...state,
        token: action.payload.token,
      }

    default:
      return state
  }
}
