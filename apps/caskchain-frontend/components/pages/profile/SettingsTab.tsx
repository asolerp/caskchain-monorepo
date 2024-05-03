import { useAccount } from '@hooks/web3/useAccount'
import { useGlobal } from '@providers/global'
import { Spacer } from 'caskchain-ui'

const SettingsTab = () => {
  const {
    state: { address },
  } = useGlobal()

  const { user } = useAccount()

  return (
    <div>
      <h2 className="font-relay text-white text-3xl">Settings</h2>
      <Spacer size="lg" />
      <div>
        <div className="border border-gray-500 p-5 rounded-md ">
          <p className="font-poppins text-white text-lg">
            You have signed in using:{' '}
            <span className="text-cask-chain">{address}</span>
          </p>
        </div>
        <Spacer size="sm" />
        <div className="border border-gray-500 p-5 rounded-md ">
          <p className="font-poppins text-white text-lg">
            Username: <span className="text-cask-chain">{user?.nickname}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SettingsTab
