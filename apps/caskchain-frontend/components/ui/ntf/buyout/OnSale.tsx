import Button from '@ui/common/Button'
import Spacer from '@ui/common/Spacer'
import { Nft } from '@_types/nft'
import { ethers } from 'ethers'
import { addressSimplifier } from 'utils/addressSimplifier'
import { useEffect, useState } from 'react'

type Props = {
  cask: Nft
  rates: any
  onBuy: () => void
  onBuyWithERC20: () => void
}

const OnSale: React.FC<Props> = ({ cask, rates, onBuy, onBuyWithERC20 }) => {
  const MATICEUR = rates?.find((rate: any) => rate?._id === 'matic')?.lastPrice

  const [selectedCoin, setSelectedCoin] = useState<'ETH' | 'MATIC' | 'USDT'>()

  useEffect(() => {
    if (cask?.price && cask?.price > 0) {
      return setSelectedCoin('ETH')
    }
    return setSelectedCoin('USDT')
  }, [cask])

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
            {selectedCoin === 'USDT'
              ? `${ethers.utils
                  .formatEther(cask?.erc20Prices?.USDT)
                  .toString()} $`
              : `${
                  cask?.price &&
                  ethers.utils.formatEther(cask?.price).toString()
                } MATIC`}
          </h2>
          <p className="text-white">
            {(Number(ethers.utils.formatEther(cask?.price)) * MATICEUR).toFixed(
              2
            )}{' '}
            EUR
          </p>
        </div>
      </div>
      <Spacer size="md" />
      <div className="flex items-center">
        <Button
          fit={false}
          active
          onClick={selectedCoin === 'ETH' ? onBuy : onBuyWithERC20}
        >
          BUY CASK
        </Button>
      </div>
    </div>
  )
}

export default OnSale
