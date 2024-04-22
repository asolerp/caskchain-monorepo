import { Switch } from '@headlessui/react'
import { BellIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import useGetBalance from '@hooks/common/useGetBalance'
import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'
import { useMediaQuery } from 'react-responsive'

import ItemMenu from '@ui/common/ItemMenu'
import Spacer from '@ui/common/Spacer'

import Image from 'next/image'

import { useRouter } from 'next/router'

import React, { useState } from 'react'

import { magic } from 'lib/magic'
import useWindowDimensions from '@hooks/common/useWindowDimensions'
import { Sidebar } from 'react-pro-sidebar'
import { NAVBAR_HEIGHT } from '.'
import { SignOutUser } from 'lib/firebase/firebase'

import { useSideBar } from '@hooks/web3/useSideBar'

type SidebarProps = {
  open: boolean
}

const SidebarComponent: React.FC<SidebarProps> = ({ open }) => {
  const { data } = useSideBar()
  const { width } = useWindowDimensions()

  const isMobile = useMediaQuery({ query: '(max-width: 640px)' })

  const router = useRouter()
  const { dispatch } = useGlobal()

  const { balance } = useGetBalance()
  const [activeNotification, setActiveNotification] = useState(false)

  const handleLogout = async () => {
    dispatch({ type: GlobalTypes.SET_USER, payload: { user: null } })
    dispatch({ type: GlobalTypes.SET_ADDRESS, payload: { address: null } })

    localStorage.removeItem('user')
    await (magic as any)?.wallet.disconnect()
    SignOutUser()

    router.reload()
  }

  return (
    <div className="absolute mt-24">
      <Sidebar
        width={isMobile ? `${width}px` : '500px'}
        rtl={true}
        backgroundColor={'#21211f'}
        rootStyles={{
          marginTop: NAVBAR_HEIGHT,
          paddingBottom: NAVBAR_HEIGHT,
          opacity: 1,
          borderLeft: '1px solid #1B1B1B',
          paddingHorizontal: '30px',
        }}
        onBackdropClick={() =>
          dispatch({
            type: GlobalTypes.SET_SIDE_BAR,
            payload: { status: false },
          })
        }
        toggled={open}
        breakPoint="all"
      >
        <div className="flex flex-col justify-between  p-4 px-12 h-full">
          <div className=" border-gray-500 border-[0.5px] rounded-lg mt-4 p-4">
            <section className="flex flex-col w-full items-center ">
              <p className="font-poppins text-white text-2xl">Barrels</p>
              <Spacer size="xs" />
              <p className="text-cask-chain text-4xl">{data?.length}</p>
            </section>
            <Spacer size="sm" />
            <section className="flex flex-col w-full items-center">
              <p className="font-poppins text-white text-2xl">Balance</p>
              <Spacer size="xs" />
              <p className="font-poppins font-semibold text-4xl text-cask-chain">
                {balance?.substring(0, 7)} {process.env.NEXT_PUBLIC_TOKEN_NAME}
              </p>
              {/* {sidebar.walletType === 'magic' && (
                <>
                  <Spacer size="md" />
                  <Button containerStyle="px-20 py-4" onClick={openWallet} fit>
                    Open wallet
                  </Button>
                </>
              )} */}
            </section>
          </div>
          <section className="flex flex-col self-end pb-10 w-full">
            <div className="flex flex-col divide-y-[1px] divide-gray-700 w-full bg-[#292929] rounded-xl">
              <ItemMenu
                onClick={() => router.push('/profile')}
                leftSide={
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-200 font-poppins text-xl">
                      Profile
                    </span>
                    <Spacer size="sm" />
                    <Image
                      src="/icons/profile.svg"
                      width={20}
                      height={20}
                      alt="barrels"
                    />
                  </div>
                }
              />
              <ItemMenu
                onClick={() => router.push('/cellar/my-casks')}
                leftSide={
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-200 font-poppins text-xl">
                      My cellar
                    </span>
                    <Spacer size="sm" />
                    <Image
                      src="/icons/barrels.svg"
                      width={20}
                      height={20}
                      alt="barrels"
                    />
                  </div>
                }
              />
              <ItemMenu
                leftSide={
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-200 font-poppins text-xl">
                      Notifications
                    </span>
                    <Spacer size="sm" />
                    <BellIcon width={20} height={20} color="#B8B8B8" />
                  </div>
                }
                rightSide={
                  <Switch
                    checked={activeNotification}
                    onChange={() => setActiveNotification(!activeNotification)}
                    className={`${
                      activeNotification ? 'bg-cask-chain' : 'bg-gray-300'
                    }
                     relative inline-flex flex-shrink-0 h-[28px] w-[54px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                  >
                    <span
                      aria-hidden="true"
                      className={`${
                        activeNotification ? 'translate-x-6' : 'translate-x-0'
                      }
                     pointer-events-none inline-block h-[24px] w-[24px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                    />
                  </Switch>
                }
              />
              <ItemMenu
                leftSide={
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-200 font-poppins text-xl">
                      Support
                    </span>
                    <Spacer size="sm" />
                    <Image
                      src="/icons/support.svg"
                      width={20}
                      height={20}
                      color="#B8B8B8"
                      alt="support"
                    />
                  </div>
                }
                rightSide={
                  <div className="flex flex-row items-center space-x-2">
                    <ChevronRightIcon
                      width={20}
                      height={20}
                      color="#B8B8B8"
                    ></ChevronRightIcon>
                    <Spacer size="sm" />
                    <span className="text-purple-600 font-poppins">
                      Discord
                    </span>
                  </div>
                }
              />
            </div>
            <Spacer size="md" />
            <div className="flex flex-col divide-y-[1px] divide-gray-700 w-full bg-[#292929] rounded-xl">
              <ItemMenu
                leftSide={
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-200 font-poppins text-xl">
                      Security
                    </span>
                    <Spacer size="sm" />
                    <Image
                      src="/icons/security.svg"
                      width={20}
                      height={20}
                      alt="barrels"
                    />
                  </div>
                }
              />
            </div>
            <Spacer size="md" />
            <div className="flex flex-col divide-y-[1px] divide-gray-700 w-full bg-[#292929] rounded-xl">
              <ItemMenu
                onClick={handleLogout}
                leftSide={
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-200 font-poppins text-xl">
                      Log Out
                    </span>
                    <Spacer size="sm" />
                    <Image
                      src="/icons/logout.svg"
                      width={20}
                      height={20}
                      alt="barrels"
                    />
                  </div>
                }
              />
            </div>
          </section>
        </div>
      </Sidebar>
    </div>
  )
}

export default SidebarComponent
