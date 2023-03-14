import { Nft } from '@_types/nft'
import { ethers } from 'ethers'

type Props = {
  cask: Nft
  onBuy: () => void
}

const OnSale: React.FC<Props> = ({ cask, onBuy }) => {
  return (
    <div className="p-6 w-2/3 bg-slate-800 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90  grid grid-cols-1 divide-y shadow-xl">
      <div className="w-2/3">
        <h1 className="text-2xl font-semibold text-gray-100 mb-4">
          {cask?.meta?.name.toUpperCase()}
        </h1>
        <p className="text-emerald-300">SOLD BY</p>
        <p className="text-gray-300">CASK CHAIN</p>
      </div>
      <div className="flex items-center">
        <div>
          <p className="text-emerald-300 mb-1">PRICE</p>
          <h2 className="text-5xl text-gray-100">
            {cask?.price && ethers.utils.formatEther(cask?.price).toString()}{' '}
            ETH
          </h2>
        </div>
      </div>
      <div className="flex items-center">
        <button
          onClick={onBuy}
          className="bg-emerald-400 hover:bg-emerald-700 text-gray-100 text-xl font-bold py-4 px-4 rounded w-full"
        >
          BUY CASK
        </button>
      </div>
    </div>
  )
}

export default OnSale
