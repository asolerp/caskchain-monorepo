import { useAccount } from '@hooks/web3/useAccount'
import { useGlobal } from '@providers/global'

import Button from '@ui/common/Button'
import ClientOnly from 'components/pages/ClientOnly'
import { getCookie } from 'cookies-next'

import Image from 'next/image'

import { addressSimplifier } from 'utils/addressSimplifier'

const Walletbar: React.FC = () => {
  const {
    state: { address, sideBar },
  } = useGlobal()

  const token = getCookie('token')
  const { handleOpenSidebar, user, loading, checkIfUserDataIsNeeded, connect } =
    useAccount()

  if (token && address) {
    return (
      <>
        <div className="lg:hidden">
          <Image
            onClick={() => handleOpenSidebar(sideBar)}
            src={user?.imageProfile || '/images/user.png'}
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
                onClick={() => handleOpenSidebar(sideBar)}
                className="cursor-pointer px-1 py-1 justify-center items-center hover:border bg-cask-chain flex text-sm rounded-full focus:outline-none"
              >
                <Image
                  src={user?.imageProfile || '/images/user.png'}
                  alt=""
                  width={40}
                  height={40}
                  className="rounded-full w-[40px] h-[40px] object-cover"
                />
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

  if (address) {
    return (
      <ClientOnly>
        <div>
          <Button
            loading={loading}
            onClick={() => {
              checkIfUserDataIsNeeded()
            }}
          >
            {'Sign In'}
          </Button>
        </div>
      </ClientOnly>
    )
  }

  return (
    <ClientOnly>
      <div>
        <Button
          containerStyle="px-6 py-2"
          loading={loading}
          onClick={() => {
            connect()
          }}
        >
          {'Start'}
        </Button>
      </div>
    </ClientOnly>
  )
}

export default Walletbar
