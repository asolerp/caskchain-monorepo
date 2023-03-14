import { Menu } from '@headlessui/react'
import Image from 'next/image'
import Link from 'next/link'
import { addressSimplifier } from 'utils/addressSimplifier'

type WalletbarProps = {
  isLoading: boolean
  user: any
  isInstalled: boolean
  token: string | null
  account: string
  connect: () => void
  logout: () => void
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const Walletbar: React.FC<WalletbarProps> = ({
  isLoading,
  isInstalled,
  account,
  token,
  user,
  logout,
  connect,
}) => {
  if (isLoading) {
    return (
      <div>
        <button
          type="button"
          className="inline-flex items-center px-3 py-3 border border-transparent text-sm font-medium font-poppins rounded-full shadow-sm text-slate-700 bg-cask-chain hover:bg-opacity-80 focus:outline-none"
        >
          Loading ...
        </button>
      </div>
    )
  }

  if (token && user?.email) {
    return (
      <Menu as="div" className="ml-3 relative ">
        <div className="flex justify-center items-center">
          <div>
            <Menu.Button className="px-1 py-1 justify-center items-center hover:border bg-cask-chain flex text-sm rounded-full focus:outline-none">
              <Image src="/images/user.png" alt="" width={40} height={40} />
              <p className="px-2 text-sm font-poppins text-black">
                {user?.nickname || addressSimplifier(account)}
              </p>
            </Menu.Button>
          </div>
        </div>

        <Menu.Items className="z-10 origin-top-right absolute right-0 mt-4 w-48  shadow-lg py-1 bg-slate-700 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90">
          <Menu.Item>
            {() => (
              <button
                disabled={true}
                className="disabled:text-amber-300 text-lg block px-4 pt-2 mb-2 text-amber-300"
              >
                {user?.nickname ||
                  `0x${account[2]}${account[3]}${account[4]}....${account.slice(
                    -4
                  )}`}
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link href="/profile">
                <span
                  className={classNames(
                    active
                      ? 'bg-cask-chain text-black font-semibold'
                      : 'text-gray-300',
                    'block px-4 py-2 text-sm '
                  )}
                >
                  Profile
                </span>
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <span
                onClick={() => logout()}
                className={classNames(
                  active
                    ? 'bg-cask-chain text-black font-semibold'
                    : 'text-gray-300',
                  'block px-4 py-2 text-sm'
                )}
              >
                Logout
              </span>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    )
  }

  if (isInstalled) {
    return (
      <div>
        <button
          onClick={() => {
            connect()
          }}
          type="button"
          className="inline-flex items-center px-6 py-3 border border-transparent text-sm text-white font-medium rounded-full bg-emerald-800 hover:bg-emerald-900 shadow-xl"
        >
          Start
        </button>
      </div>
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
