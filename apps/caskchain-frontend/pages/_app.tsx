import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { ParallaxProvider } from 'react-scroll-parallax'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'react-datepicker/dist/react-datepicker.css'

import GlobalProvider from '@providers/global'
import { AnimatePresence } from 'framer-motion'

import useInitAnalytics from '@hooks/common/useInitAnalytics'
import { LoadingProvider } from 'components/contexts/LoadingContext'
import { useEffect } from 'react'
import { Web3Provider } from 'caskchain-lib'
import { magic } from 'lib/magic'
import useInitWeb3Listeners from '@hooks/common/useInitWeb3Listeners'

export default function App({ Component, pageProps }: AppProps) {
  useInitAnalytics()
  useInitWeb3Listeners()

  useEffect(() => {
    document.body.style.overflowX = 'hidden'
  }, [])

  return (
    <>
      <ToastContainer theme="dark" />
      <Web3Provider magic={magic}>
        <GlobalProvider>
          <ParallaxProvider>
            <AnimatePresence mode="wait" initial={false}>
              <LoadingProvider>
                <Component {...pageProps} />
              </LoadingProvider>
            </AnimatePresence>
          </ParallaxProvider>
        </GlobalProvider>
      </Web3Provider>
    </>
  )
}
