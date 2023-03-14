import { Nft } from '@_types/nft'

import { useState } from 'react'

type Props = {
  cask: Nft
  onOffer: (offer: string) => void
}

const MakeOffer: React.FC<Props> = ({ cask, onOffer }) => {
  const [offer, setOffer] = useState<number>(0)

  return (
    <div className="p-6 w-2/3 bg-slate-800 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90 border border-slate-500 grid grid-cols-1 divide-y">
      <div className="w-2/3">
        <h1 className="text-2xl font-semibold text-gray-100 mb-4">
          {cask?.meta?.name.toUpperCase()}
        </h1>
        <p className="text-amber-300">OWNER</p>
        <p className="text-gray-300">{`0x${cask?.owner?.address?.[2]}${
          cask?.owner?.address?.[3]
        }${cask?.owner?.address?.[4]}....${cask?.owner?.address?.slice(
          -4
        )}`}</p>
      </div>
      <div className="flex items-center">
        <div className="w-full">
          <p className="text-amber-300">OFFER</p>
          <input
            min={1}
            max={cask?.fractions?.available}
            value={offer}
            onChange={(e) => setOffer(Number(e.target.value))}
            type="number"
            id="first_name"
            className="w-full bg-transparent border-0 mt-2 text-5xl text-gray-100 focus:ring-0 rounded-lg "
            required
          />
        </div>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => onOffer(offer.toString())}
          className="bg-emerald-400 hover:bg-emerald-700 text-gray-100 text-xl font-bold py-4 px-4 rounded w-full"
        >
          MAKE OFFER
        </button>
      </div>
    </div>
  )
}

export default MakeOffer
