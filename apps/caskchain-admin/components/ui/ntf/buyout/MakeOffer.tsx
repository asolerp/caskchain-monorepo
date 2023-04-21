import React from 'react'
import Button from '@ui/common/Button'
import Input from '@ui/common/Input'
import Spacer from '@ui/common/Spacer'
import Spinner from '@ui/common/Spinner'
import { Nft } from '@_types/nft'

import { useState } from 'react'
import { addressSimplifier } from 'utils/addressSimplifier'
import { useAccount } from 'wagmi'

type Props = {
  cask: Nft
  isLoading?: boolean
  onCancelOffer: () => void
  onOffer: (offer: string) => void
}

const MakeOffer: React.FC<Props> = ({
  cask,
  isLoading,
  onCancelOffer,
  onOffer,
}) => {
  const [offer, setOffer] = useState<number>()
  const { address } = useAccount()

  const hasOffer = cask?.offer?.bidders?.some(
    (bidder: string) => bidder === address
  )

  return (
    <div className="p-6 w-2/3 h-fit bg-black-light rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90 border border-gray-700 grid grid-cols-1 ">
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Spinner color="cask-chain" />
        </div>
      ) : (
        <>
          <div className="w-2/3">
            <h1 className="text-2xl font-semibold text-gray-100 mb-4">
              {cask?.meta?.name.toUpperCase()}
            </h1>
            <p className="text-cask-chain">OWNER</p>
            <p className="text-gray-300">
              {cask?.owner?.nickname || addressSimplifier(cask?.owner?.address)}
            </p>
          </div>
          <Spacer size="md" />
          <div className="flex items-center">
            <div className="w-full">
              <p className="text-cask-chain">OFFER</p>
              <Input
                min={1}
                max={cask?.fractions?.available}
                value={offer}
                onChange={(e: any) => setOffer(Number(e.target.value))}
                type="number"
                id="first_name"
                placeholder="Place an offer"
                required
              />
            </div>
          </div>
          <Spacer size="sm" />
          <div className="flex flex-col items-center">
            {hasOffer && (
              <>
                <Button
                  containerStyle="bg-red-500 hover:bg-red-600 py-3"
                  labelStyle="text-white font-medium text-center font-poppins"
                  fit={false}
                  onClick={() => onCancelOffer()}
                >
                  Cancel last offer
                </Button>
                <Spacer size="xs" />
              </>
            )}
            <Button
              fit={false}
              onClick={() => offer && onOffer(offer.toString())}
            >
              {hasOffer ? 'Bid harder' : 'Make Offer'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default React.memo(MakeOffer)
