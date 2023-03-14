import { hookFactory as createAuthHook, UseAuthHook } from './useAuth'

export type GlobalHooks = {
  useAuth: UseAuthHook
}

export type SetupHooks = {
  (): GlobalHooks
}

export const setupHooks: SetupHooks = () => {
  return {
    useAuth: createAuthHook(),
  }
}
