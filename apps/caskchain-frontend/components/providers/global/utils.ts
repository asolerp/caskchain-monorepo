import { GlobalHooks, setupHooks } from '@hooks/auth/setupHooks'

export type GlobalState = {
  user: any
  token: string | null
  shareModal: boolean
  signInModal: boolean
  networkModal: boolean
  sideBar: boolean
  loading: boolean
  userInfoModal: boolean
  mainAnimationFinished: boolean
  animationsExecuted: {
    main: boolean
    nav: boolean
  }
  hooks: GlobalHooks
}

export enum GlobalTypes {
  SET_LOADING = 'SET_LOADING',
  SET_SHARE_MODAL = 'SET_SHARE_MODAL',
  SET_NETWORK_MODAL = 'SET_NETWORK_MODAL',
  SET_ANIMATIN_EXECUTED = 'SET_ANIMATIN_EXECUTED',
  SET_MAIN_ANIMATION_FINISHED = 'SET_MAIN_ANIMATION_FINISHED',
  SET_SIGN_IN_MODAL = 'SET_SIGN_IN_MODAL',
  SET_USER_INFO_MODAL = 'SET_USER_INFO_MODAL',
  SET_USER = 'SET_USER',
  SET_TOKEN = 'SET_TOKEN',
  SET_SIDE_BAR = 'SET_SIDE_BAR',
}

type SetLoading = {
  type: typeof GlobalTypes.SET_LOADING
  payload: any
}

type SetShareModal = {
  type: typeof GlobalTypes.SET_SHARE_MODAL
  payload: {
    status: boolean
  }
}

type SetNetworkModal = {
  type: typeof GlobalTypes.SET_NETWORK_MODAL
  payload: {
    status: boolean
  }
}

type SetAnimationsExecuted = {
  type: typeof GlobalTypes.SET_ANIMATIN_EXECUTED
  payload: any
}

type SetMainAnimationFinished = {
  type: typeof GlobalTypes.SET_MAIN_ANIMATION_FINISHED
  payload: any
}

type SetSignInModal = {
  type: typeof GlobalTypes.SET_SIGN_IN_MODAL
  payload: {
    status: boolean
  }
}

type SetSideBar = {
  type: typeof GlobalTypes.SET_SIDE_BAR
  payload: {
    status: boolean
  }
}

type SetToken = {
  type: typeof GlobalTypes.SET_TOKEN
  payload: any
}

type SetUserInfoModal = {
  type: typeof GlobalTypes.SET_USER_INFO_MODAL
  payload: {
    status: boolean
  }
}

type SetUser = {
  type: typeof GlobalTypes.SET_USER
  payload: any
}

export type GlobalActionTypes =
  | SetToken
  | SetUser
  | SetSignInModal
  | SetUserInfoModal
  | SetSideBar
  | SetMainAnimationFinished
  | SetAnimationsExecuted
  | SetNetworkModal
  | SetShareModal
  | SetLoading

export const initialState: GlobalState = {
  user: null,
  token: null,
  loading: false,
  sideBar: false,
  shareModal: false,
  signInModal: false,
  networkModal: false,
  userInfoModal: false,
  mainAnimationFinished: false,
  animationsExecuted: {
    main: false,
    nav: false,
  },
  hooks: setupHooks(),
}
