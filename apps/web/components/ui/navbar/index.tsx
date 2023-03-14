import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

import ActiveLink from '../link'

import { useAccount, useNetwork } from '@hooks/web3'
import Walletbar from './Walletbar'
import SignInModal from '@ui/modals/SignInModal'

import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'
import UserInfoModal from '@ui/modals/UserInfoModal'
import { useAuth } from '@hooks/auth'
import Link from 'next/link'
import { getCookie } from 'cookies-next'

const navigation = [
  { name: 'Marketplace', href: '/marketplace' },
  { name: 'Exchange', href: '/exchange' },
  { name: 'About us', href: '/about' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  useAuth()
  const { account } = useAccount()
  const { network } = useNetwork()
  const token = getCookie('token')
  const {
    state: { userInfoModal, signInModal, user },
    dispatch,
  } = useGlobal()

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
      <Disclosure as="nav">
        {({ open }) => (
          <>
            <div className="absolute z-50 mx-auto w-full px-2 sm:px-6 lg:px-20">
              <div className="relative bg-transparent flex h-24 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-1 items-center">
                    <Link href={`/`}>
                      <div className="flex flex-row space-x-3 items-center">
                        <p className=" text-4xl font-bold text-white text-opacity-90">
                          CaskChain
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div className="flex flex-grow space-x-3 justify-center items-center">
                    {navigation.map((item) => (
                      <ActiveLink
                        activeclass="bg-emerald-400 text-slate-100"
                        key={item.name}
                        href={item.href}
                      >
                        <span
                          className={
                            'text-white hover:bg-gray-700 hover:text-white px-4 py-5 rounded-full text-sm font-semibold'
                          }
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name.toUpperCase()}
                        </span>
                      </ActiveLink>
                    ))}
                  </div>
                  <div className="flex flex-1 justify-end items-center pr-2 sm:static sm:inset-auto sm:pr-0">
                    <div className="text-gray-200 self-center mr-2">
                      <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-slate-700 text-white shadow-lg">
                        <svg
                          className="-ml-0.5 mr-1.5 h-2 w-2 text-emerald-600"
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
                      isInstalled={account.isInstalled}
                      isLoading={account.isLoading}
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
                {navigation.map((item) => (
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
    </>
  )
}
