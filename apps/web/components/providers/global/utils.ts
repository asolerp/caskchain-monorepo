import { GlobalHooks, setupHooks } from '@hooks/auth/setupHooks'

export type GlobalState = {
  user: any
  token: string | null
  signInModal: boolean
  userInfoModal: boolean
  hooks: GlobalHooks
}

export enum GlobalTypes {
  SET_SIGN_IN_MODAL = 'SET_SIGN_IN_MODAL',
  SET_USER_INFO_MODAL = 'SET_USER_INFO_MODAL',
  SET_USER = 'SET_USER',
  SET_TOKEN = 'SET_TOKEN',
}

type SetSignInModal = {
  type: typeof GlobalTypes.SET_SIGN_IN_MODAL
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

export const initialState: GlobalState = {
  user: null,
  token: null,
  signInModal: false,
  userInfoModal: false,
  hooks: setupHooks(),
}
