import { Disclosure } from '@headlessui/react'
import { Bars3Icon, WalletIcon, XMarkIcon } from '@heroicons/react/24/outline'

import ActiveLink from '../link'
import { motion, useAnimation } from 'framer-motion'
import { useAccount, useNetwork } from '@hooks/web3'
import Walletbar from './Walletbar'
import SignInModal from '@ui/modals/SignInModal'

import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'
import UserInfoModal from '@ui/modals/UserInfoModal'
import { useAuth } from '@hooks/auth'
import Link from 'next/link'
import { getCookie } from 'cookies-next'
import Image from 'next/image'
import Sidebar from './Sidebar'
import { useEffect } from 'react'

const navigation = [
  { name: 'Home', href: '/' },
  // { name: 'Explore', href: '/explore' },
  { name: 'Marketplace', href: '/marketplace' },
  // { name: 'About us', href: '/about' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  useAuth()
  const { account } = useAccount()
  const { network } = useNetwork()
  const token = getCookie('token') as string
  const {
    state: {
      userInfoModal,
      signInModal,
      user,
      sideBar,
      mainAnimationFinished,
      animationsExecuted: { nav },
    },
    dispatch,
  } = useGlobal()

  const openClass = sideBar ? 'bg-black-light' : ''

  const controls = useAnimation()
  useEffect(() => {
    if (mainAnimationFinished && !nav) {
      controls.start('visible')
    }
  }, [mainAnimationFinished])

  const navVariants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: -100 },
  }

  return (
    <>
      <SignInModal
        modalIsOpen={signInModal}
        closeModal={() =>
          dispatch({
            type: GlobalTypes.SET_SIGN_IN_MODAL,
            payload: { status: false },
          })
        }
      />
      <UserInfoModal
        modalIsOpen={userInfoModal}
        closeModal={() =>
          dispatch({
            type: GlobalTypes.SET_USER_INFO_MODAL,
            payload: { status: false },
          })
        }
      />

      <Sidebar open={sideBar} />

      <motion.div
        initial={!nav ? 'hidden' : 'visible'}
        animate={controls}
        onAnimationComplete={() =>
          dispatch({
            type: GlobalTypes.SET_ANIMATIN_EXECUTED,
            payload: { animation: 'nav' },
          })
        }
        variants={navVariants}
        transition={{ duration: 1 }}
      >
        <Disclosure as="nav">
          {({ open }) => (
            <>
              <div
                className={`absolute z-50 mx-auto w-full px-2 sm:px-6 lg:px-32 transition-all duration-500 ${openClass}`}
              >
                <div className="relative bg-transparent flex h-24 items-center justify-between">
                  <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    {/* Mobile menu button*/}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                  <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                    <div className="flex flex-1 items-center">
                      <Link href={`/`}>
                        <div className="flex flex-row space-x-3 items-center">
                          <Image
                            src="/images/logo.svg"
                            width={205}
                            height={200}
                            alt="caskchain_logo"
                          />
                        </div>
                      </Link>
                    </div>
                    <div className="flex flex-grow space-x-3 justify-center items-center">
                      {navigation.map((item) => (
                        <ActiveLink
                          activeclass="text-cask-chain border-b-2 border-b-cask-chain"
                          key={item.name}
                          href={item.href}
                        >
                          <span
                            className={
                              'text-white font-poppins hover:border-b-2 hover:border-b-cask-chain px-4 py-5 text-sm'
                            }
                          >
                            {item.name}
                          </span>
                        </ActiveLink>
                      ))}
                    </div>
                    <div className="flex flex-1 justify-end items-center pr-2 sm:static sm:inset-auto sm:pr-0">
                      <WalletIcon
                        onClick={() => account.multiConnect()}
                        width={40}
                        height={40}
                        className="text-cask-chain mr-5"
                      />
                      <div className="text-gray-200 self-center mr-2">
                        <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium ring-2 ring-cask-chain text-white shadow-lg">
                          <svg
                            className="-ml-0.5 mr-1.5 h-2 w-2 text-cask-chain"
                            fill="currentColor"
                            viewBox="0 0 8 8"
                          >
                            <circle cx={4} cy={4} r={3} />
                          </svg>
                          {network.isLoading
                            ? 'Loading...'
                            : account.isInstalled
                            ? network.data
                            : 'Install Web3 Wallet'}
                        </span>
                      </div>
                      <Walletbar
                        token={token}
                        user={user}
                        isConnected={account.isConnected}
                        isInstalled={account.isInstalled}
                        account={account?.data as string}
                        connect={account.connect}
                        logout={account.logout}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="sm:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                  {navigation.map((item: any) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block px-3 py-2 rounded-md text-base font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </motion.div>
    </>
  )
}
