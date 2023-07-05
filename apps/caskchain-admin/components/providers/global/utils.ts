export type GlobalState = {
  address: string | null
  user: any
  networkModal: boolean
  loading: boolean
}

export enum GlobalTypes {
  SET_ADDRESS = 'SET_ADDRESS',
  SET_LOADING = 'SET_LOADING',
  SET_NETWORK_MODAL = 'SET_NETWORK_MODAL',
  SET_USER = 'SET_USER',
}

type SetAddress = {
  type: typeof GlobalTypes.SET_ADDRESS
  payload: any
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

export type GlobalActionTypes =
  | SetAddress
  | SetUser
  | SetNetworkModal
  | SetLoading

export const initialState: GlobalState = {
  address: null,
  user: null,
  loading: false,
  networkModal: false,
}
