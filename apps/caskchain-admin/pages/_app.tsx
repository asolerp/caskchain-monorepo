import '../scripts/wdyr'
import '../styles/globals.css'
// import type { AppProps } from 'next/app'
// import { Web3Provider } from '@providers'

// import { ToastContainer } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
// import GlobalProvider from '@providers/global'
// import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
// import { Web3Modal } from '@web3modal/react'
// import { configureChains, createClient, WagmiConfig } from 'wagmi'
// import { localhost, polygonMumbai } from 'wagmi/chains'
// import { AnimatePresence } from 'framer-motion'

// const chains = [localhost, polygonMumbai]
// const projectId = '7ba8a5909e41332fb0abe840c1d4923e'

// const { provider } = configureChains(chains, [w3mProvider({ projectId })])

// const wagmiClient = createClient({
//   autoConnect: true,
//   connectors: w3mConnectors({ projectId, version: 1, chains }),
//   provider,
// })

// const ethereumClient = new EthereumClient(wagmiClient, chains)

export default function App() {
  return (
    <>
      <h1>HOLA</h1>
      {/* <ToastContainer theme="dark" closeOnClick />
      <GlobalProvider>
        <WagmiConfig client={wagmiClient}>
          <Web3Provider>
            <AnimatePresence mode="wait" initial={false}>
              <Component {...pageProps} />
            </AnimatePresence>
            <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
          </Web3Provider>
        </WagmiConfig>
      </GlobalProvider> */}
    </>
  )
}
