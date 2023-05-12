import { BellIcon } from '@heroicons/react/24/outline'
import { useAccount, useOwnedNfts } from '@hooks/web3'
import { useGlobal } from '@providers/global'
import Button from '@ui/common/Button'
import ItemMenu from '@ui/common/ItemMenu'
import Spacer from '@ui/common/Spacer'

import ClientOnly from 'components/pages/ClientOnly'
import { openTransak } from 'lib/crypto/transak'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import React from 'react'
import { useBalance } from 'wagmi'

type SidebarProps = {
  open: boolean
}

type addressType = `0x${string}`

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const openClass = open ? 'translate-x-0' : 'translate-x-full'
  const { account } = useAccount()
  const { nfts } = useOwnedNfts()
  const router = useRouter()
  const {
    state: { user },
  } = useGlobal()

  const { data } = useBalance({
    address: account?.data as addressType,
  })

  return (
    <div
      className={`hidden absolute overflow-auto lg:flex flex-col p-4 mt-24 right-0 h-[calc(100vh-96px)] rounded-bl-[50px] w-[500px] shadow-2xl border-t border-gray-700 bg-black-light transition-transform ease-in-out duration-500 z-50 px-12 ${openClass}`}
    >
      <ClientOnly>
        <div className="flex flex-col items-center p-4">
          <section>
            <h3 className="font-rale font-semibold text-white text-4xl">
              {user?.nickname}
            </h3>
            <Spacer size="md" />
            <p className="font-poppins text-white text-xl">
              My cellar:{' '}
              <span className="text-cask-chain">
                {nfts?.data?.length} {`NFT${nfts?.data?.length > 1 ? 's' : ''}`}
              </span>
            </p>
          </section>
          <Spacer size="xl" />
          <section className="flex flex-col items-center">
            <p className="font-poppins text-xl text-white">Total balance</p>
            {account && data && (
              <p className="font-poppins font-semibold text-lg text-cask-chain">
                {Number(data?.formatted).toFixed(2)} {data?.symbol}
              </p>
            )}
            <Spacer size="md" />
            <Button containerStyle="px-20 py-4" onClick={openTransak} fit>
              Add funds
            </Button>
          </section>
          <Spacer size="2xl" />
          <Spacer size="2xl" />
          <section className="flex flex-col items-center">
            <p className="font-poppins font-bold text-2xl text-white">
              Invite frinds
            </p>
            <Spacer size="xs" />
            <p className="font-poppins text-lg text-gray-300 text-center ">
              Send it to your friends or show them the QR code
            </p>
            <Spacer size="md" />
            <Image
              src="/images/qr-code.png"
              width={300}
              height={300}
              alt="cask_chain_qr"
            />
            <Spacer size="md" />
            <Button fit={false}>Share</Button>
            <Spacer size="md" />
            <Button active={false} fit={false}>
              Download
            </Button>
          </section>
          <Spacer size="2xl" />
          <Spacer size="2xl" />
          <section className="flex flex-col items-center w-full">
            <div className="flex flex-col divide-y-[1px] divide-gray-700 w-full bg-[#292929] rounded-xl">
              <ItemMenu
                onClick={() => router.push('/profile/my-collection')}
                leftSide={
                  <div className="flex items-center space-x-2">
                    <Image
                      src="/icons/barrels.svg"
                      width={20}
                      height={20}
                      alt="barrels"
                    />
                    <span className="text-gray-200 font-poppins text-xl">
                      My cellar
                    </span>
                  </div>
                }
              />
              <ItemMenu
                leftSide={
                  <div className="flex items-center space-x-2">
                    <BellIcon width={20} height={20} color="#B8B8B8" />
                    <span className="text-gray-200 font-poppins text-xl">
                      Notifications
                    </span>
                  </div>
                }
              />
            </div>
            <Spacer size="md" />
            <div className="flex flex-col divide-y-[1px] divide-gray-700 w-full bg-[#292929] rounded-xl">
              <ItemMenu
                onClick={account.logout}
                leftSide={
                  <div className="flex items-center space-x-2">
                    <Image
                      src="/icons/logout.svg"
                      width={20}
                      height={20}
                      alt="barrels"
                    />
                    <span className="text-gray-200 font-poppins text-xl">
                      Log Out
                    </span>
                  </div>
                }
              />
            </div>
          </section>
          {/* <h3 className="font-poppins font-semibold text-xl text-gray-600">
            Saldo total
          </h3>
          <Spacer size="xs" />
          {account && data && (
            <p className="font-poppins font-semibold text-2xl text-white">
              {Number(data?.formatted).toFixed(2)} {data?.symbol}
            </p>
          )}
          <Spacer size="xl" />
          <h3 className="font-poppins font-semibold text-xl text-gray-600">
            Accepted alter coins
          </h3>
          <Spacer size="md" />
          <div className="w-full px-10">
            <div className="flex flex-row justify-between border-t border-b border-white">
              <p className="font-poppins text-gray-200 text-lg">Tether</p>
              <p className="font-poppins text-gray-200 text-lg">
                {parseInt(account?.erc20Balances?.usdt).toFixed(2)} USDT
              </p>
            </div>
          </div>
          <Spacer size="lg" />
          <Button onClick={openTransak} fit={false}>
            Add funds
          </Button> */}
        </div>
      </ClientOnly>
      {/* <Spacer size="md" />
      <div>
        <div className="border-t border-b border-gray-700 w-full py-3">
          <Link
            href="/profile/my-collection"
            className="font-rela font-medium text-gray-200 text-xl hover:text-cask-chain"
          >
            My cellar
          </Link>
        </div>
        <div className="border-b border-gray-700 w-full py-3">
          <Link
            href="/activity/transactions"
            className="font-rela font-medium text-gray-200 text-xl hover:text-cask-chain"
          >
            My transactions
          </Link>
        </div>
      </div>
      <div className="flex flex-grow items-end justify-center">
        <p
          onClick={account.logout}
          className="text-white font-poppins font-semibold cursor-pointer"
        >
          Logout
        </p>
      </div> */}
    </div>
  )
}

export default Sidebar
