import Button from '@ui/common/Button'
import Spacer from '@ui/common/Spacer'
import { Nft } from '@_types/nft'
import { ethers } from 'ethers'

type Props = {
  cask: Nft
  onBuy: () => void
}

const OnSale: React.FC<Props> = ({ cask, onBuy }) => {
  return (
    <div className="p-6 w-2/3 h-fit bg-black-light rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90 border border-gray-700 grid grid-cols-1 ">
      <div className="w-2/3">
        <h1 className="text-2xl font-semibold text-gray-100 mb-4">
          {cask?.meta?.name.toUpperCase()}
        </h1>
        <p className="text-cask-chain">SOLD BY</p>
        <p className="text-gray-300">CASK CHAIN</p>
      </div>
      <Spacer size="md" />
      <div className="flex items-center">
        <div>
          <p className="text-cask-chain mb-1">PRICE</p>
          <h2 className="text-5xl text-gray-100">
            {cask?.price && ethers.utils.formatEther(cask?.price).toString()}{' '}
            ETH
          </h2>
        </div>
      </div>
      <Spacer size="md" />
      <div className="flex items-center">
        <Button fit={false} active onClick={onBuy}>
          BUY CASK
        </Button>
      </div>
    </div>
  )
}

export default OnSale
