import Button from '@ui/common/Button'
import { Nft } from '@_types/nft'

import Image from 'next/image'
import { useState } from 'react'
import { addressSimplifier } from 'utils/addressSimplifier'

type NftItemProps = {
  item: Nft
  active?: boolean
  isMarketPlace?: boolean
  blow?: boolean
}

const BarrelNft: React.FC<NftItemProps> = ({
  item,
  active = false,
  isMarketPlace = false,
}) => {
  const [isHover, setIsHover] = useState(active)

  const isMarketPlaceClass = isMarketPlace ? 'h-full w-80' : 'h-full w-[460px]'

  return (
    <div
      className="relative"
      onMouseEnter={() => !active && setIsHover(true)}
      onMouseLeave={() => !active && setIsHover(false)}
    >
      <div
        className={`relative bg-black-light rounded-[40px] bg-clip-padding backdrop-filter backdrop-blur-sm border border-gray-800 ${isMarketPlaceClass}`}
      >
        <div className="relative">
          <div className="flex justify-center items-center rounded-md">
            <Image
              className={`w-full object-contain rounded-tl-[40px] rounded-tr-[40px]`}
              src={'/images/nft.png'}
              alt="New NFT"
              width={300}
              height={0}
            />
          </div>
        </div>
        <div className="relative">
          <div
            className={`flex-1 px-4 py-6 mt-2 flex flex-col justify-between ${
              isHover ? '-translate-y-20' : ''
            } transition-transform`}
          >
            <div className="w-full ">
              <p className="font-poppins text-cask-chain">Cask Number #25</p>
              <h3 className="text-2xl font-rale text-white font-semibold w-3/4">
                {item.meta.name}
              </h3>
            </div>
            <div>
              <p className="text-cask-chain font-poppins text-sm">
                {addressSimplifier(item.owner.address)}
              </p>
            </div>
            <div className="flex-1">
              <div className="mt-4">
                <div className="flex flex-row items-start justify-start flex-wrap space-x-1">
                  {item.meta.attributes.map((attribute) => (
                    <div key={attribute.trait_type} className="">
                      <div className="flex flex-row justify-between space-x-1">
                        <dt className=" text-sm font-medium text-gray-300">
                          {attribute.trait_type}
                        </dt>
                        <dd className="text-sm font-extrabold text-cask-chain">
                          {attribute.value}
                        </dd>
                        <p className="text-white">•</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div
            className={`absolute w-full bottom-0 left-0 px-4 pb-6 ${
              isHover ? 'opacity-100' : 'opacity-0'
            } transition-all duration-500`}
          >
            <Button fit={false}>Place a bid</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BarrelNft
