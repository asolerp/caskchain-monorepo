import { Nft } from '@_types/nft'
import { ethers } from 'ethers'
import { useState } from 'react'

type Props = {
  cask: Nft
  onBuyFraction: (fractions: number) => void
  onFullBuy: () => void
}

const FractionalizedBuyout: React.FC<Props> = ({
  cask,
  onBuyFraction,
  onFullBuy,
}) => {
  const [fractions, setFractions] = useState<number>(0)

  const fullNftPrie = cask?.fractions?.listingPrice
  const fractionPrice =
    cask.fractions?.unitPrice &&
    (Number(ethers.utils.parseEther('1')) / cask.fractions.unitPrice).toString()

  return (
    <div className="p-6 w-2/3 bg-slate-800 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90 border border-slate-500 grid grid-cols-1 divide-y">
      <div className="w-2/3">
        <h1 className="text-2xl font-semibold text-gray-100 mb-4">
          {cask?.meta?.name.toUpperCase()}
        </h1>
        <div className="flex flex-col space-y-2 mb-4">
          <div>
            <p className="text-emerald-300">SOLD BY</p>
            <p className="text-gray-300">CASK CHAIN</p>
          </div>
          <div>
            <p className="text-emerald-300">TOTAL FRACTIONS</p>
            <p className="text-gray-300">{cask?.fractions?.total}</p>
          </div>
          <div>
            <p className="text-emerald-300">AVAILABLE FRACTIONS</p>
            <p className="text-gray-300">
              {cask?.fractions?.available?.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      {cask?.fractions?.available > 0 && (
        <>
          <div className="flex items-center py-3">
            <div className="w-full">
              <p className="text-emerald-300">NUMBER OF FRACTIONS</p>
              <input
                min={1}
                max={cask?.fractions?.available}
                value={fractions}
                onChange={(e) => setFractions(Number(e.target.value))}
                type="number"
                id="first_name"
                className="w-full bg-transparent border-0 mt-2 text-5xl text-gray-100 focus:ring-0 rounded-lg "
                required
              />
            </div>
          </div>
          <div className="flex flex-col items-center py-3">
            <button
              onClick={() => onFullBuy()}
              className="bg-red-400 hover:bg-red-700 text-gray-100 text-xl font-bold py-4 px-4 rounded w-full mb-3"
            >
              BUY FULL NFT BY {ethers.utils.formatEther(fullNftPrie)} ETH
            </button>
            <button
              onClick={() => onBuyFraction(fractions)}
              className="bg-emerald-400 hover:bg-emerald-700 text-gray-100 text-xl font-bold py-4 px-4 rounded w-full"
            >
              BUY FRACTIONS BY ~{' '}
              {(
                Number(ethers.utils.formatEther(fractionPrice)) *
                Number(fractions)
              ).toFixed(2)}{' '}
              ETH
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default FractionalizedBuyout
