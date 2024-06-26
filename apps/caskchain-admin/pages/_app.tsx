import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'

import type { AppProps } from 'next/app'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import GlobalProvider from '@providers/global'

import { AnimatePresence } from 'framer-motion'
import { Web3Provider } from 'caskchain-lib'
import { magic } from 'lib/magic'
import { Provider } from 'utils/Provider'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <ToastContainer theme="dark" closeOnClick />
      <Web3Provider magic={magic}>
        <GlobalProvider>
          <AnimatePresence mode="wait" initial={false}>
            <Component {...pageProps} />
          </AnimatePresence>
        </GlobalProvider>
      </Web3Provider>
    </Provider>
  )
}
