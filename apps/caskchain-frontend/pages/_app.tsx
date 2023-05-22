import '../scripts/wdyr'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Web3Provider } from '@providers'
import { ParallaxProvider } from 'react-scroll-parallax'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import GlobalProvider from '@providers/global'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { localhost, polygonMumbai } from 'wagmi/chains'
import { AnimatePresence } from 'framer-motion'

import useInitAnalytics from '@hooks/common/useInitAnalytics'
import { LoadingProvider } from 'components/contexts/LoadingContext'
import { useEffect } from 'react'

const chains = [localhost, polygonMumbai]
const projectId = '7ba8a5909e41332fb0abe840c1d4923e'

const { provider } = configureChains(chains, [w3mProvider({ projectId })])

const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider,
})

const ethereumClient = new EthereumClient(wagmiClient, chains)

export default function App({ Component, pageProps }: AppProps) {
  useInitAnalytics()

  useEffect(() => {
    document.body.style.overflowX = 'hidden'
  }, [])

  return (
    <>
      <ToastContainer />
      <GlobalProvider>
        <WagmiConfig client={wagmiClient}>
          <Web3Provider>
            <ParallaxProvider>
              <AnimatePresence mode="wait" initial={false}>
                <LoadingProvider>
                  <Component {...pageProps} />
                </LoadingProvider>
              </AnimatePresence>
            </ParallaxProvider>
            <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
          </Web3Provider>
        </WagmiConfig>
      </GlobalProvider>
    </>
  )
}
