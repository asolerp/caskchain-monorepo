import React from 'react'

import ActiveLink from '../link'

import Walletbar from './Walletbar'
import SignInModal from '@ui/modals/SignInModal'

import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'
import UserInfoModal from '@ui/modals/UserInfoModal'
import Link from 'next/link'

import Image from 'next/image'
import Sidebar from './Sidebar'
import NetworkModal from '@ui/modals/NetworkModal'
import ShareModal from '@ui/modals/ShareModal'

const navigation = [
  { name: 'Home', href: '/', url: '/', key: 'home' },
  {
    name: 'Marketplace',
    href: '/marketplace/search',
    url: '/marketplace/[tab]',
    key: 'marketplace',
  },
  {
    name: 'About us',
    href: '/about',
    url: '/about',
    key: 'about',
  },
]

const Navbar = () => {
  const {
    state: { userInfoModal, signInModal, networkModal, shareModal, sideBar },
    dispatch,
  } = useGlobal()

  const openClass = sideBar ? 'bg-black-light' : ''

  return (
    <div className="w-screen z-50">
      <NetworkModal
        modalIsOpen={networkModal}
        closeModal={() =>
          dispatch({
            type: GlobalTypes.SET_NETWORK_MODAL,
            payload: { status: false },
          })
        }
      />
      <ShareModal
        modalIsOpen={shareModal}
        closeModal={() =>
          dispatch({
            type: GlobalTypes.SET_SHARE_MODAL,
            payload: { status: false },
          })
        }
      />
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

      <div
        className={`absolute z-40 mx-auto w-full px-2 sm:px-6 lg:px-32 transition-all duration-500 ${openClass}`}
      >
        <div className="relative bg-transparent flex h-24 items-center justify-between">
          <div className="flex flex-row lg:grid lg:grid-cols-12 w-full items-center justify-between lg:justify-center px-2 lg:px-0">
            <div className="lg:col-span-4 items-center">
              <Link href={`/`}>
                <div className="flex flex-row space-x-3 items-center">
                  <Image
                    src="/images/logo.svg"
                    width={205}
                    height={200}
                    className="w-40 h-12 lg:w-62 lg:h-62"
                    alt="caskchain_logo"
                  />
                </div>
              </Link>
            </div>
            <div className="lg:hidden">
              <Link href="/marketplace/search">
                <Image
                  src="/icons/filters/spirit.svg"
                  width={30}
                  height={30}
                  alt="spirits_marketplace"
                />
              </Link>
            </div>
            <div className="hidden lg:flex col-span-4 space-x-3 justify-center items-center">
              {navigation.map((item) => (
                <div key={item.key}>
                  <ActiveLink
                    activeclass="text-cask-chain border-b-2 border-b-cask-chain"
                    href={item.href}
                    url={item.url}
                  >
                    <span
                      className={
                        'text-white font-poppins hover:border-b-2 hover:border-b-cask-chain px-4 py-5 text-sm'
                      }
                    >
                      {item.name}
                    </span>
                  </ActiveLink>
                </div>
              ))}
            </div>
            <div className="lg:flex lg:col-span-4 lg:justify-end lg:items-center pr-2 ">
              <Walletbar />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(Navbar)
