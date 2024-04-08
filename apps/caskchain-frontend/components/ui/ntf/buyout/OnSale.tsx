import Button from '@ui/common/Button'
import Spacer from '@ui/common/Spacer'
import { Nft } from '@_types/nft'
import { ethers } from 'ethers'
import { addressSimplifier } from 'utils/addressSimplifier'

type Props = {
  cask: Nft
  rates: any
  onBuy: () => void
  onBuyWithERC20: () => void
}

const OnSale: React.FC<Props> = ({ cask, onBuyWithERC20 }) => {
  return (
    <div className="p-6 w-full h-fit bg-black-light rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90 border border-gray-700 grid grid-cols-1 ">
      <div className="w-2/3">
        <h1 className="text-2xl font-semibold text-gray-100 mb-4">
          {cask?.meta?.name.toUpperCase()}
        </h1>
        <p className="text-cask-chain">SOLD BY</p>
        <p className="text-gray-300">
          {cask?.owner?.nickname
            ? `@${cask?.owner?.nickname}`
            : addressSimplifier(cask?.owner?.address)}
        </p>
      </div>
      <Spacer size="md" />
      <div className="flex items-center">
        <div>
          <p className="text-cask-chain mb-1">PRICE</p>
          <h2 className="text-5xl text-gray-100">
            {ethers.formatEther(cask?.erc20Prices?.USDT).toString()} USDT
          </h2>
        </div>
      </div>
      <Spacer size="md" />
      <div className="flex items-center">
        <Button fit={false} active onClick={onBuyWithERC20}>
          BUY CASK
        </Button>
      </div>
    </div>
  )
}

export default OnSale
