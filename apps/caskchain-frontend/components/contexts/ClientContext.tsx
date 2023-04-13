import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { Web3Modal } from '@web3modal/standalone'

import UniversalProvider from '@walletconnect/universal-provider'
import { PairingTypes, SessionTypes } from '@walletconnect/types'
import Client from '@walletconnect/sign-client'

import { providers } from 'ethers'

const DEFAULT_PROJECT_ID = 'b4f89a8b63c034ceb9f1bd0fa7d03432'
const DEFAULT_RELAY_URL = 'wss://relay.walletconnect.com'
const DEFAULT_LOGGER = 'debug'

/**
 * Types
 */
interface IContext {
  client: Client | undefined
  session: SessionTypes.Struct | undefined
  connect: (caipChainId: string, pairing?: { topic: string }) => Promise<void>
  disconnect: () => Promise<void>
  isInitializing: boolean
  chain: string
  pairings: PairingTypes.Struct[]
  accounts: string[]
  isFetchingBalances: boolean
  web3Provider?: providers.Web3Provider
}

/**
 * Context
 */
export const ClientContext = createContext<IContext>({} as IContext)

/**
 * Provider
 */
/**
 * Provider
 */
export function ClientContextProvider({
  children,
}: {
  children: ReactNode | ReactNode[]
}) {
  const [client, setClient] = useState<Client>()
  const [pairings, setPairings] = useState<PairingTypes.Struct[]>([])
  const [session, setSession] = useState<SessionTypes.Struct>()

  const [ethereumProvider, setEthereumProvider] = useState<UniversalProvider>()
  const [web3Provider, setWeb3Provider] = useState<providers.Web3Provider>()

  const [isFetchingBalances, setIsFetchingBalances] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [hasCheckedPersistedSession, setHasCheckedPersistedSession] =
    useState(false)

  const [accounts, setAccounts] = useState<string[]>([])

  const [chain, setChain] = useState<string>('')
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>()

  const resetApp = () => {
    setPairings([])
    setSession(undefined)
    setAccounts([])
    setChain('')
  }

  const disconnect = useCallback(async () => {
    if (typeof ethereumProvider === 'undefined') {
      throw new Error('ethereumProvider is not initialized')
    }
    await ethereumProvider.disconnect()
    resetApp()
  }, [ethereumProvider])

  const createClient = useCallback(async () => {
    try {
      setIsInitializing(true)

      const provider = await UniversalProvider.init({
        projectId: DEFAULT_PROJECT_ID,
        logger: DEFAULT_LOGGER,
        relayUrl: DEFAULT_RELAY_URL,
      })

      const web3Modal = new Web3Modal({
        projectId: DEFAULT_PROJECT_ID,
        walletConnectVersion: 2,
      })

      setEthereumProvider(provider)
      setClient(provider.client)
      setWeb3Modal(web3Modal)
    } catch (err) {
      throw err
    } finally {
      setIsInitializing(false)
    }
  }, [])

  const createWeb3Provider = useCallback(
    (ethereumProvider: UniversalProvider) => {
      const web3Provider = new providers.Web3Provider(ethereumProvider)
      setWeb3Provider(web3Provider)
    },
    []
  )

  const connect = useCallback(
    async (caipChainId: string, pairing?: { topic: string }) => {
      if (!ethereumProvider) {
        throw new ReferenceError('WalletConnect Client is not initialized.')
      }

      const session = await ethereumProvider.connect({
        namespaces: {
          eip155: {
            methods: [
              'eth_sendTransaction',
              'eth_signTransaction',
              'eth_sign',
              'personal_sign',
              'eth_signTypedData',
            ],
            chains: [`eip155:1337`],
            events: ['chainChanged', 'accountsChanged'],
            rpcMap: {
              80001:
                'https://warmhearted-alpha-wish.matic-testnet.discover.quiknode.pro/e691cd069dcd0cbe40b3b07d635227bb68835f28/',
            },
          },
        },
        pairingTopic: pairing?.topic,
      })

      createWeb3Provider(ethereumProvider)
      const _accounts = await ethereumProvider.enable()
      setAccounts(_accounts)
      setSession(session)

      web3Modal?.closeModal()
    },
    [ethereumProvider, createWeb3Provider, web3Modal]
  )

  const onSessionConnected = useCallback(
    async (_session: SessionTypes.Struct) => {
      if (!ethereumProvider) {
        throw new ReferenceError('EthereumProvider is not initialized.')
      }
      const allNamespaceAccounts = Object.values(_session.namespaces)
        .map((namespace) => namespace.accounts)
        .flat()

      const chainData = allNamespaceAccounts[0].split(':')
      const caipChainId = `${chainData[0]}:${chainData[1]}`
      setChain(caipChainId)
      setSession(_session)
      setAccounts(allNamespaceAccounts.map((account) => account.split(':')[2]))
      createWeb3Provider(ethereumProvider)
    },
    [ethereumProvider, createWeb3Provider]
  )

  const _checkForPersistedSession = useCallback(
    async (provider: UniversalProvider) => {
      if (typeof provider === 'undefined') {
        throw new Error('WalletConnect is not initialized')
      }
      const pairings = provider.client.pairing.getAll({ active: true })
      // populates existing pairings to state
      setPairings(pairings)
      if (typeof session !== 'undefined') return
      // populates (the last) existing session to state
      if (ethereumProvider?.session) {
        const _session = ethereumProvider?.session
        await onSessionConnected(_session)
        return _session
      }
    },
    [session, ethereumProvider, onSessionConnected]
  )

  useEffect(() => {
    if (!client) {
      createClient()
    }
  }, [client, createClient])

  useEffect(() => {
    const fetchBalances = async () => {
      if (!web3Provider || !accounts) return

      try {
        setIsFetchingBalances(true)
      } catch (error: any) {
        throw new Error(error)
      } finally {
        setIsFetchingBalances(false)
      }
    }

    fetchBalances()
  }, [web3Provider, accounts])

  useEffect(() => {
    const getPersistedSession = async () => {
      if (!ethereumProvider) return
      await _checkForPersistedSession(ethereumProvider)
      setHasCheckedPersistedSession(true)
    }

    if (ethereumProvider && !hasCheckedPersistedSession) {
      getPersistedSession()
    }
  }, [ethereumProvider, _checkForPersistedSession, hasCheckedPersistedSession])

  const value = useMemo(
    () => ({
      pairings,
      isInitializing,

      isFetchingBalances,
      accounts,
      chain,
      client,
      session,
      disconnect,
      connect,

      web3Provider,
    }),
    [
      pairings,
      isInitializing,
      isFetchingBalances,
      accounts,
      chain,
      client,
      session,
      disconnect,
      connect,
      web3Provider,
    ]
  )

  return (
    <ClientContext.Provider
      value={{
        ...value,
      }}
    >
      {children}
    </ClientContext.Provider>
  )
}

export function useWalletConnectClient() {
  const context = useContext(ClientContext)
  if (context === undefined) {
    throw new Error(
      'useWalletConnectClient must be used within a ClientContextProvider'
    )
  }
  return context
}
