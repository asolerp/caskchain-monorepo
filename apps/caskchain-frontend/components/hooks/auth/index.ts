import { useHooks } from '@providers/global'

export const useAuth = () => {
  const hooks = useHooks()
  const swrRes = hooks.useAuth()
  return {
    auth: swrRes,
  }
}
