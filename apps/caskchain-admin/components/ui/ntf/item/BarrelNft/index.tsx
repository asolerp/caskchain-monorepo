import Button from '@ui/common/Button'
import { NftAttribute } from '@_types/nft'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { addressSimplifier } from 'utils/addressSimplifier'
import BookmarkIcon from 'public/icons/bookmark.svg'
import { useRouter } from 'next/router'

type NftItemProps = {
  item: any
  active?: boolean
  isFavorite?: boolean
  isMarketPlace?: boolean
  showAnimation?: boolean
  showFavorite?: boolean
  onPressFavorite?: (nftId: string) => void
  blow?: boolean
}

const BarrelNft: React.FC<NftItemProps> = ({
  item,
  active = false,
  showAnimation = true,
  isFavorite = false,
  showFavorite = true,
  isMarketPlace = false,
  onPressFavorite,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isHover, setIsHover] = useState(active)
  const router = useRouter()
  const isMarketPlaceClass = isMarketPlace
    ? 'h-full w-80'
    : 'h-full w-[460px] m-0'

  useEffect(() => {
    if (videoRef.current) {
      if (isHover) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }, [isHover])

  return (
    <div className="relative">
      {showFavorite && (
        <div className="absolute right-5 top-5 z-50">
          <BookmarkIcon
            color={isFavorite ? '#CAFC01' : '#fff'}
            fill={isFavorite ? '#CAFC01' : 'transparent'}
            onClick={() => onPressFavorite && onPressFavorite(item.tokenId)}
            className="cursor-pointer"
            width={20}
            height={20}
          />
        </div>
      )}
      <div
        onClick={() => router.push(`/cask/${item.tokenId}`)}
        className="relative flex flex-row justify-center items-center"
        onMouseEnter={() => !active && setIsHover(true)}
        onMouseLeave={() => !active && setIsHover(false)}
      >
        <div
          className={`bg-black-light rounded-[40px] bg-clip-padding backdrop-filter backdrop-blur-sm border border-gray-800 ${isMarketPlaceClass}`}
        >
          <div className="relative">
            <div className="flex justify-center items-center rounded-md">
              {(!isHover || !showAnimation) && (
                <Image
                  className={`w-full object-contain rounded-tl-[40px] rounded-tr-[40px]`}
                  src={'/images/nft.png'}
                  alt="New NFT"
                  width={300}
                  height={300}
                />
              )}
              {isHover && showAnimation && (
                <video
                  ref={videoRef}
                  width="600"
                  height="600"
                  className="h-[400px]"
                  // className="w-100 h-100"
                  controls={false}
                  src="https://res.cloudinary.com/enalbis/video/upload/v1681586853/CaskChain/flofru3viqsirclxlapx.mp4"
                />
              )}
            </div>
          </div>
          <div className="relative">
            <div
              className={`flex-1 px-4 py-6 mt-2 flex flex-col justify-between ${
                isHover ? '-translate-y-20' : ''
              } transition-transform`}
            >
              <div className="w-full ">
                <p className="font-poppins text-cask-chain">
                  Cask Number {`#${item.tokenId}`}
                </p>
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
                    {item.meta.attributes.map((attribute: NftAttribute) => (
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
    </div>
  )
}

export default BarrelNft
