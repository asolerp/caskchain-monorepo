import { Nft } from '@_types/nft'
import { ethers } from 'ethers'
import Image from 'next/image'
import { useState } from 'react'

type NftItemProps = {
  item: Nft
  isMarketPlace?: boolean
  blow?: boolean
}

const GeneralNftInfo: React.FC<NftItemProps> = ({
  item,
  isMarketPlace = false,
  blow,
}) => {
  const [isHover, setIsHover] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {(isHover || blow) && (
        <div className="absolute w-80 h-full -inset-0.5 bg-[#A7FF99] rounded-lg blur-sm"></div>
      )}
      <div className="relative p-2 h-full w-80 bg-black rounded-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90 border-[4px] border-[#374F29]">
        <div className="relative">
          <div className="w-full mb-3">
            <h3 className="text-2xl text-center font-semibold text-gray-100 mt-1">
              {item.meta.name}
            </h3>
          </div>
          <div className="flex justify-center items-center rounded-md">
            <Image
              className={`w-full object-contain `}
              src={'/images/suau_1.png'}
              alt="New NFT"
              width={300}
              height={0}
            />
          </div>
        </div>
        <div className="flex-1 p-6 mt-2 flex flex-col justify-between ">
          <div className="flex-1">
            <div className="mt-4 pb-5">
              <div className="grid grid-cols-1 gap-2">
                {item.meta.attributes.map((attribute) => (
                  <div key={attribute.trait_type} className="">
                    <div className="flex flex-row justify-between">
                      <dt className=" text-sm font-medium text-gray-300">
                        {attribute.trait_type.toUpperCase()}
                      </dt>
                      <dd className="text-sm font-extrabold text-gray-100">
                        {attribute.value}
                      </dd>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {!isMarketPlace && (
          <div className="mt-3">
            <button className="bg-emerald-400 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded w-full">
              Buy for {ethers.utils.formatEther(Number(item.price).toString())}{' '}
              ETH
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default GeneralNftInfo
