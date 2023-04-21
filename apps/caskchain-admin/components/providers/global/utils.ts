import { GlobalHooks, setupHooks } from '@hooks/auth/setupHooks'

export type GlobalState = {
  user: any
  networkModal: boolean
  loading: boolean
  hooks: GlobalHooks
}

export enum GlobalTypes {
  SET_LOADING = 'SET_LOADING',
  SET_NETWORK_MODAL = 'SET_NETWORK_MODAL',
  SET_USER = 'SET_USER',
}

type SetLoading = {
  type: typeof GlobalTypes.SET_LOADING
  payload: any
}

type SetNetworkModal = {
  type: typeof GlobalTypes.SET_NETWORK_MODAL
  payload: {
    status: boolean
  }
}

type SetUser = {
  type: typeof GlobalTypes.SET_USER
  payload: any
}

export type GlobalActionTypes = SetUser | SetNetworkModal | SetLoading

export const initialState: GlobalState = {
  user: null,
  loading: false,
  networkModal: false,
  hooks: setupHooks(),
}
