import Button from '@ui/common/Button'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { addressSimplifier } from 'utils/addressSimplifier'
import BookmarkIcon from 'public/icons/bookmark.svg'
import { useRouter } from 'next/router'

import Spacer from '@ui/common/Spacer'
import { ipfsImageParser } from 'utils/ipfsImageParser'
import { motion } from 'framer-motion'
import { ethers } from 'ethers'

type NftItemProps = {
  item: any
  rates?: any
  active?: boolean
  isFavorite?: boolean
  isMarketPlace?: boolean
  showAnimation?: boolean
  isProfile?: boolean
  defaultImage?: boolean
  showFavorite?: boolean
  onPressProfileCTA?: () => void
  onPressFavorite?: (nftId: string) => void
  blow?: boolean
}

const DEFAULT_IMAGE = '/images/nft.png'
const BARREL_HEIGHT = 650

const BarrelNft: React.FC<NftItemProps> = ({
  item,
  active = false,
  showAnimation = true,
  isFavorite = false,
  isProfile = false,
  showFavorite = false,
  defaultImage = false,
  isMarketPlace = false,
  onPressProfileCTA,
  onPressFavorite,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isHover, setIsHover] = useState(active)
  const router = useRouter()
  const isMarketPlaceClass = isMarketPlace
    ? 'h-full w-full'
    : `h-[${BARREL_HEIGHT}px] w-[460px] m-0`

  const isProfileMeta = isProfile ? item.meta : item
  const mainImage = item && ipfsImageParser(isProfileMeta?.image)

  console.log('item', item)

  useEffect(() => {
    if (!item.video) return
    if (videoRef.current) {
      if (isHover) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }, [isHover, item?.video])

  const variants = {
    hover: {
      border: '1px solid #CAFC01',
      transition: {
        duration: 5, // Adjust the duration as needed
      },
    },
    initial: {
      border: '0px solid transparent',
    },
  }

  return (
    <motion.div
      className={`group relative cursor-pointer min-h-[${BARREL_HEIGHT}px] rounded-[30px] ${
        isMarketPlace
          ? 'group-hover:scale-[1.02] transform-gpu transition-all'
          : ''
      }`}
      variants={variants}
      initial="initial"
      whileHover="hover"
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
        onClick={() => router.push(`/cask/${item.id || item.tokenId}`)}
        className={`relative flex flex-row justify-center items-center min-h-[${BARREL_HEIGHT}px] h-full`}
      >
        <div
          className={`relative bg-black-light rounded-[30px] bg-clip-padding backdrop-filter backdrop-blur-sm border min-h-[${BARREL_HEIGHT}px] border-gray-800 ${isMarketPlaceClass}`}
        >
          <div className="relative h-[330px] w-full overflow-hidden rounded-tl-[30px] rounded-tr-[30px]">
            <div className="overflow-hidden relative w-full flex justify-center items-center">
              {(!isHover || !showAnimation || !item?.video) && (
                <Image
                  onMouseEnter={() => setIsHover(true)}
                  onMouseLeave={() => setIsHover(false)}
                  className={`w-full rounded-tl-[30px] rounded-tr-[30px] h-[330px] object-cover`}
                  src={defaultImage ? DEFAULT_IMAGE : mainImage}
                  alt="New NFT"
                  width={300}
                  height={450}
                  priority
                />
              )}
              {isHover && showAnimation && item?.video && (
                <video
                  ref={videoRef}
                  width="600"
                  height="600"
                  onEnded={() => setIsHover(false)}
                  onMouseLeave={() => setIsHover(false)}
                  className="h-[330px] scale-[3] overflow-hidden"
                  controls={false}
                  src={item?.video}
                />
              )}
            </div>
          </div>
          <div className="relative h-[320px] w-full">
            <div className="absolute bottom-0 py-4 w-full h-full group-hover:-translate-y-20 transition-all duration-300">
              <div className={`flex-1 flex flex-col h-full justify-between`}>
                <div className="flex flex-col justify-between w-full h-full px-4">
                  <div>
                    <div className="flex flex-row justify-between">
                      <p className="font-poppins text-cask-chain">
                        Cask Number {`#${item.id || item.tokenId}`}
                      </p>
                      <div>
                        <p className="bg-cask-chain px-2 rounded-lg font-poppins text-sm text-gray-900">
                          {item?.owner?.nickname
                            ? `@${item?.owner?.nickname}`
                            : addressSimplifier(item?.owner?.address)}
                        </p>
                      </div>
                    </div>
                    <Spacer size="xs" />
                    <h3 className="text-xl font-rale text-white font-semibold">
                      {isProfileMeta?.name}
                    </h3>
                  </div>
                  <div className="flex flex-row flex-wrap  justify-start items-center">
                    <div className="flex items-center">
                      <p className="text-cask-chain text-[12px]">
                        {isProfileMeta.attributes?.liquor?.toUpperCase()}
                      </p>
                      <p className="text-cask-chain px-1">{' · '}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-cask-chain text-[12px]">
                        {isProfileMeta.attributes?.distillery?.toUpperCase()}
                      </p>
                      <p className="text-cask-chain px-1">{' · '}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-cask-chain text-[12px]">
                        {isProfileMeta.attributes?.country?.toUpperCase()}
                      </p>
                      <p className="text-cask-chain px-1">{' · '}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-cask-chain text-[12px]">
                        {isProfileMeta.attributes?.region?.toUpperCase()}
                      </p>
                      <p className="text-cask-chain px-1">{' · '}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-cask-chain text-[12px]">
                        {isProfileMeta.attributes?.cask_wood?.toUpperCase()}
                      </p>
                      <p className="text-cask-chain px-1">{' · '}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-cask-chain text-[12px]">
                        {isProfileMeta.attributes?.age?.toUpperCase()}
                        years
                      </p>
                      <p className="text-cask-chain px-1">{' · '}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-cask-chain text-[12px]">
                        {isProfileMeta.attributes?.cask_size?.toUpperCase()}L
                      </p>
                      <p className="text-cask-chain px-1">{' · '}</p>
                    </div>
                    <p className="text-cask-chain text-[12px]">
                      {isProfileMeta.attributes?.abv?.toUpperCase()}%
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-500 my-5"></div>
                {item?.fraction ? (
                  <div className="px-4">
                    {item?.price ? (
                      <div className="flex flex-row items-center justify-between">
                        <p className="text-gray-400">Barrel price</p>
                        <p className="text-white">
                          {ethers.formatEther(item?.price)} MATIC
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-400">
                        Buy a fraction of this barrel!
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="px-4">
                    {item?.price ? (
                      <div className="flex flex-row items-center justify-between">
                        <p className="text-gray-400">Price</p>
                        <p className="text-white">
                          {ethers.formatEther(item?.price)} USDT
                        </p>
                      </div>
                    ) : (
                      <p className="w-fit px-2 rounded-lg text-gray-100 bg-red-700">
                        Already sold!
                      </p>
                    )}
                  </div>
                )}
                {isProfile && onPressProfileCTA && (
                  <div className="flex flex-col h-full justify-end">
                    <Spacer size="md" />
                    <Button
                      onClick={() => onPressProfileCTA && onPressProfileCTA()}
                      fit={false}
                    >
                      Put it on sale!
                    </Button>
                  </div>
                )}
              </div>
            </div>
            {!isProfile && (
              <div className="absolute bottom-5 w-full px-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="flex flex-col h-full justify-end">
                  <Spacer size="md" />
                  <Button
                    onClick={() =>
                      router.push(`/cask/${item.id || item.tokenId}`)
                    }
                    fit={false}
                  >
                    {item?.fraction
                      ? 'BUY FRACTION'
                      : item?.price
                      ? 'BUY NOW'
                      : 'VIEW DETAILS'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default BarrelNft
