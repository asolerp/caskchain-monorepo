import { useAccount } from '@hooks/web3'
import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'
import Button from '@ui/common/Button'
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
      <>
        <div className="lg:hidden">
          <Image
            onClick={handleOpenSidebar}
            src="/images/user.png"
            alt=""
            width={40}
            height={40}
            className="w-12 h-12 ring-cask-chain ring-1 rounded-full"
          />
        </div>
        <div className="hidden lg:flex ml-3 relative">
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
      </>
    )
  }

  return (
    <ClientOnly>
      <div>
        <Button
          loading={account.loading}
          onClick={() => {
            account.connect()
          }}
        >
          {'Start'}
        </Button>
      </div>
    </ClientOnly>
  )
}

export default Walletbar
