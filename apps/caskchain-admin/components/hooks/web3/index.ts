import { useHooks } from '@providers/web3'

export const useAccount = () => {
  const hooks = useHooks()
  const swrRes = hooks.useAccount()
  return {
    account: swrRes,
  }
}

export const useStats = () => {
  const hooks = useHooks()
  const swrRes = hooks.useStats()
  return {
    stats: swrRes,
  }
}

export const useCaskNft = ({ caskId }: { caskId: string }) => {
  const hooks = useHooks()
  const swrRes = hooks.useCask({ caskId })
  return {
    cask: swrRes,
  }
}

export const useNetwork = () => {
  const hooks = useHooks()
  const swrRes = hooks.useNetwork()

  return {
    network: swrRes,
  }
}

export const useAllNfts = () => {
  const hooks = useHooks()
  const swrRes = hooks.useAllNfts()

  return {
    nfts: swrRes,
  }
}

export const useFractionalizedNfts = () => {
  const hooks = useHooks()
  const swrRes = hooks.useFractionalizedNfts()

  return {
    fractionalizedNfts: swrRes,
  }
}

export const useListedNfts = () => {
  const hooks = useHooks()
  const swrRes = hooks.useListedNfts()

  return {
    nfts: swrRes,
  }
}

export const useNftTransactions = () => {
  const hooks = useHooks()
  const swrRes = hooks.useNftTransactions()

  return {
    transactions: swrRes,
  }
}
