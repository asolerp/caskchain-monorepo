import { useAccount } from '@hooks/web3'
import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'
import ClientOnly from 'components/pages/ClientOnly'
import Image from 'next/image'

import { addressSimplifier } from 'utils/addressSimplifier'

const Walletbar: React.FC = () => {
  const {
    dispatch,
    state: { address, user, sideBar },
  } = useGlobal()

  const { account } = useAccount()

  const handleOpenSidebar = () => {
    dispatch({
      type: GlobalTypes.SET_SIDE_BAR,
      payload: { status: !sideBar },
    })
  }

  if (address) {
    return (
      <div className="ml-3 relative">
        <div className="flex justify-center items-center">
          <div>
            <div
              onClick={handleOpenSidebar}
              className="cursor-pointer px-1 py-1 justify-center items-center hover:border bg-cask-chain flex text-sm rounded-full focus:outline-none"
            >
              <Image src="/images/user.png" alt="" width={40} height={40} />
              <p className="px-2 text-sm font-poppins text-black">
                {user?.nickname || addressSimplifier(address)}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ClientOnly>
      <div>
        <button
          onClick={() => {
            account.connect()
          }}
          type="button"
          className="inline-flex items-center px-6 py-3 border border-transparent text-md text-black font-medium rounded-full bg-cask-chain hover:opacity-80 shadow-xl ml-3"
        >
          {'Start'}
        </button>
      </div>
    </ClientOnly>
  )
}

export default Walletbar
