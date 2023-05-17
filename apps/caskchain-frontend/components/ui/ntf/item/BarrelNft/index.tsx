import Button from '@ui/common/Button'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { addressSimplifier } from 'utils/addressSimplifier'
import BookmarkIcon from 'public/icons/bookmark.svg'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import Spacer from '@ui/common/Spacer'
import { ipfsImageParser } from 'utils/ipfsImageParser'

type NftItemProps = {
  item: any
  active?: boolean
  isFavorite?: boolean
  isMarketPlace?: boolean
  showAnimation?: boolean
  isProfile?: boolean
  defaultImage?: boolean
  showFavorite?: boolean
  onPressFavorite?: (nftId: string) => void
  blow?: boolean
}

const DEFAULT_IMAGE = '/images/nft.png'

const BarrelNft: React.FC<NftItemProps> = ({
  item,
  active = false,
  showAnimation = true,
  isFavorite = false,
  isProfile = false,
  showFavorite = false,
  defaultImage = false,
  isMarketPlace = false,
  onPressFavorite,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isHover, setIsHover] = useState(active)
  const router = useRouter()
  const isMarketPlaceClass = isMarketPlace
    ? 'h-full w-full'
    : 'h-[600px] w-[460px] m-0'

  const mainImage = item?.image && ipfsImageParser(item?.image)

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
    <div
      className={`relative cursor-pointer min-h-[650px] ${
        isMarketPlace ? 'hover:scale-[1.02] transform-gpu transition-all' : ''
      }`}
    >
      {showFavorite && (
        <div className="absolute right-5 top-5 z-30">
          <BookmarkIcon
            color={isFavorite ? '#CAFC01' : '#fff'}
            fill={isFavorite ? '#CAFC01' : 'transparent'}
            onClick={() =>
              onPressFavorite && onPressFavorite(item._id || item.tokenId)
            }
            className="cursor-pointer"
            width={20}
            height={20}
          />
        </div>
      )}
      <div
        onClick={() => router.push(`/cask/${item._id || item.tokenId}`)}
        className="relative flex flex-row justify-center items-center min-h-[650px] h-full"
      >
        <div
          className={`bg-black-light rounded-[40px] bg-clip-padding backdrop-filter backdrop-blur-sm border min-h-[650px] border-gray-800 ${isMarketPlaceClass}`}
        >
          <div className="relative">
            <div className="relative w-full flex justify-center items-center rounded-md">
              {isMarketPlace && !isProfile && (
                <div className={`absolute w-full -bottom-4 px-4 pb-6`}>
                  <Button
                    width="w-40"
                    containerStyle="bg-gray-100 rounded-full px-4 py-2 "
                    labelStyle="text-black text-center text-xs font-poppins font-semibold"
                    fit={false}
                  >
                    {item.price > 0
                      ? `Buy for ${ethers.utils.formatEther(item.price)} ETH`
                      : 'Make an offer'}
                  </Button>
                </div>
              )}
              {(!isHover || !showAnimation) && (
                <Image
                  onMouseEnter={() => setIsHover(true)}
                  onMouseLeave={() => setIsHover(false)}
                  className={`w-full rounded-tl-[40px] rounded-tr-[40px] ${
                    isMarketPlace ? 'h-[450px]' : 'h-[450px]'
                  } object-cover`}
                  src={defaultImage ? DEFAULT_IMAGE : mainImage}
                  alt="New NFT"
                  width={300}
                  height={450}
                  priority
                />
              )}
              {isHover && showAnimation && (
                <video
                  ref={videoRef}
                  width="600"
                  height="600"
                  onEnded={() => setIsHover(false)}
                  onMouseLeave={() => setIsHover(false)}
                  className="h-[450px]"
                  controls={false}
                  src="https://res.cloudinary.com/enalbis/video/upload/v1681586853/CaskChain/flofru3viqsirclxlapx.mp4"
                />
              )}
            </div>
          </div>
          <div className="relative">
            <div
              className={`flex-1 px-4 py-6 mt-2 flex flex-col justify-between `}
            >
              <div className="w-full">
                <div className="flex flex-row justify-between">
                  <p className="font-poppins text-cask-chain">
                    Cask Number {`#${item._id || item.tokenId}`}
                  </p>
                  <div>
                    <p className="text-cask-chain font-poppins text-sm">
                      {item?.owner?.nickname
                        ? `@${item?.owner?.nickname}`
                        : addressSimplifier(item?.owner?.address)}
                    </p>
                  </div>
                </div>
                <Spacer size="xs" />
                <h3 className="text-xl font-rale text-white font-semibold h-20">
                  {item?.name}
                </h3>
              </div>
              {isProfile && (
                <div className="flex flex-col h-full justify-end">
                  <Spacer size="md" />
                  <Button fit={false}>Put it on sale!</Button>
                </div>
              )}
              {/* <div className="flex-1">
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
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BarrelNft
