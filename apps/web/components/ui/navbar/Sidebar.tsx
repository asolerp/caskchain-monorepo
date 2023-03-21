import useOutsideClick from '@hooks/common/useOutsideClick'
import { useAccount } from '@hooks/web3'
import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'
import Button from '@ui/common/Button'
import Spacer from '@ui/common/Spacer'
import Spinner from '@ui/common/Spinner'
import ClientOnly from 'components/pages/ClientOnly'
import { openTransak } from 'lib/crypto/transak'
import Link from 'next/link'

import React from 'react'
import { useBalance } from 'wagmi'

type SidebarProps = {
  open: boolean
}

type addressType = `0x${string}`

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const openClass = open ? 'translate-x-0' : 'translate-x-full'
  const { account } = useAccount()

  const { data } = useBalance({
    address: account?.data as addressType,
  })

  return (
    <div
      className={`absolute flex flex-col p-4 mt-24 right-0 h-[calc(100vh-96px)] w-[500px] shadow-2xl border-l border-t border-gray-700 bg-black-light transition-transform ease-in-out duration-500 z-50 ${openClass}`}
    >
      <ClientOnly>
        <div className="flex flex-col items-center border border-gray-700 rounded-xl p-4">
          <h3 className="font-poppins font-semibold text-xl text-gray-600">
            Saldo total
          </h3>
          <Spacer size="xs" />
          {account && data && (
            <p className="font-poppins font-semibold text-2xl text-white">
              {Number(data?.formatted).toFixed(2)} {data?.symbol}
            </p>
          )}
          <Spacer size="xs" />
          <Button onClick={openTransak} fit={false}>
            Add funds
          </Button>
        </div>
      </ClientOnly>
      <Spacer size="md" />
      <div>
        <div className="border-t border-b border-gray-700 w-full py-3">
          <Link
            href="/profile"
            className="font-rela font-semibold text-gray-200 text-2xl"
          >
            My cellar
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
      </div>
    </div>
  )
}

export default Sidebar
