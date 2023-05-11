import Button from '@ui/common/Button'
import Spacer from '@ui/common/Spacer'
import { Nft } from '@_types/nft'
import { ethers } from 'ethers'
import { addressSimplifier } from 'utils/addressSimplifier'
import { useEffect, useState } from 'react'

type Props = {
  cask: Nft
  onBuy: () => void
  onBuyWithERC20: () => void
}

type CoinSelectorProps = {
  label: string
  active: boolean
  onClick: () => void
}

const CoinSelector: React.FC<CoinSelectorProps> = ({
  label,
  active,
  onClick,
}) => {
  const activeClassContainer = active
    ? 'bg-cask-chain'
    : 'border border-cask-chain'
  const activeClassLabel = active ? 'text-black' : 'text-cask-chain'
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer pinter p-4  rounded-xl ${activeClassContainer}`}
    >
      <span className={` font-poppins font-bold ${activeClassLabel}`}>
        {label}
      </span>
    </div>
  )
}

const OnSale: React.FC<Props> = ({ cask, onBuy, onBuyWithERC20 }) => {
  const [selectedCoin, setSelectedCoin] = useState<'ETH' | 'MATIC' | 'USDT'>()

  useEffect(() => {
    if (cask?.price > 0) {
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
      <div className="flex flex-row space-x-3">
        {cask?.price > 0 && (
          <CoinSelector
            label="ETH"
            active={selectedCoin === 'ETH'}
            onClick={() => setSelectedCoin('ETH')}
          />
        )}
        {cask?.erc20Prices?.USDT > 0 && (
          <CoinSelector
            label="USDT"
            active={selectedCoin === 'USDT'}
            onClick={() => setSelectedCoin('USDT')}
          />
        )}
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
                } ETH`}
          </h2>
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
