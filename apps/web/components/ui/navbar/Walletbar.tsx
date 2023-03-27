import { useAccount } from '@hooks/web3'
import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'
import ClientOnly from 'components/pages/ClientOnly'
import Image from 'next/image'
import { useEffect } from 'react'

import { addressSimplifier } from 'utils/addressSimplifier'
import { useAccount as useAccountWagmi } from 'wagmi'

type WalletbarProps = {
  user: any
  isInstalled: boolean
  isConnected: boolean
  token: string | null
  account: string
  connect: () => void
  logout: () => void
}

const Walletbar: React.FC<WalletbarProps> = ({
  isInstalled,
  isConnected,
  account,
  connect,
  token,
  user,
}) => {
  const {
    dispatch,
    state: { sideBar },
  } = useGlobal()

  const { address, isDisconnected } = useAccountWagmi()
  const { account: accountHook } = useAccount()

  useEffect(() => {
    if (address && isDisconnected) {
      accountHook.logout()
    }
  }, [isDisconnected, address])

  const handleOpenSidebar = () => {
    dispatch({
      type: GlobalTypes.SET_SIDE_BAR,
      payload: { state: !sideBar },
    })
  }

  // if (isConnecting) {
  //   return (
  //     <div>
  //       <button
  //         type="button"
  //         className="inline-flex items-center px-3 py-3 border border-transparent text-sm font-medium font-poppins rounded-full shadow-sm text-slate-700 bg-cask-chain hover:bg-opacity-80 focus:outline-none"
  //       >
  //         Loading ...
  //       </button>
  //     </div>
  //   )
  // }

  if (token && user?.email && isConnected) {
    return (
      <div className="ml-3 relative ">
        <div className="flex justify-center items-center">
          <div>
            <div
              onClick={handleOpenSidebar}
              className="cursor-pointer px-1 py-1 justify-center items-center hover:border bg-cask-chain flex text-sm rounded-full focus:outline-none"
            >
              <Image src="/images/user.png" alt="" width={40} height={40} />
              <p className="px-2 text-sm font-poppins text-black">
                {user?.nickname || addressSimplifier(account)}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isInstalled) {
    return (
      <ClientOnly>
        <div>
          <button
            onClick={() => {
              connect()
            }}
            type="button"
            className="inline-flex items-center px-6 py-3 border border-transparent text-md text-black font-medium rounded-full bg-cask-chain hover:opacity-80 shadow-xl ml-3"
          >
            {isConnected ? 'Start' : 'Connect Wallet'}
          </button>
        </div>
      </ClientOnly>
    )
  } else {
    return (
      <div>
        <button
          onClick={() => {
            window.open('https://metamask.io', '_ blank')
          }}
          type="button"
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          No Wallet
        </button>
      </div>
    )
  }
}

export default Walletbar
