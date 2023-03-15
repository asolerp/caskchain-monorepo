import { GlobalHooks, setupHooks } from '@hooks/auth/setupHooks'

export type GlobalState = {
  user: any
  token: string | null
  signInModal: boolean
  sideBar: boolean
  userInfoModal: boolean
  hooks: GlobalHooks
}

export enum GlobalTypes {
  SET_SIGN_IN_MODAL = 'SET_SIGN_IN_MODAL',
  SET_USER_INFO_MODAL = 'SET_USER_INFO_MODAL',
  SET_USER = 'SET_USER',
  SET_TOKEN = 'SET_TOKEN',
  SET_SIDE_BAR = 'SET_SIDE_BAR',
}

type SetSignInModal = {
  type: typeof GlobalTypes.SET_SIGN_IN_MODAL
  payload: any
}

type SetSideBar = {
  type: typeof GlobalTypes.SET_SIDE_BAR
  payload: any
}

type SetToken = {
  type: typeof GlobalTypes.SET_TOKEN
  payload: any
}

type SetUserInfoModal = {
  type: typeof GlobalTypes.SET_USER_INFO_MODAL
  payload: any
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

export const initialState: GlobalState = {
  user: null,
  token: null,
  sideBar: false,
  signInModal: false,
  userInfoModal: false,
  hooks: setupHooks(),
}
