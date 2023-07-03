import Button from '@ui/common/Button'

import Image from 'next/image'
import { addressSimplifier } from 'utils/addressSimplifier'
import { useRouter } from 'next/router'

import Spacer from '@ui/common/Spacer'
import { ipfsImageParser } from 'utils/ipfsImageParser'

type NftItemProps = {
  item: any
  isProfile?: boolean
  defaultImage?: boolean
}

const DEFAULT_IMAGE = '/images/nft.png'
const BARREL_HEIGHT = 650

const BarrelOffer: React.FC<NftItemProps> = ({
  item,
  isProfile = false,
  defaultImage = false,
}) => {
  const router = useRouter()
  const isMarketPlaceClass = `h-[${BARREL_HEIGHT}px] w-[400px] m-0`

  const isProfileMeta = isProfile ? item.meta : item
  const mainImage = item && ipfsImageParser(isProfileMeta?.image)

  return (
    <div className={`group relative cursor-pointer min-h-[${BARREL_HEIGHT}px]`}>
      <div
        onClick={() => router.push(`/cask/${item._id || item.tokenId}`)}
        className={`relative flex flex-row justify-center items-center min-h-[${BARREL_HEIGHT}px] h-full`}
      >
        <div
          className={`relative bg-black-light rounded-[40px] bg-clip-padding backdrop-filter backdrop-blur-sm border min-h-[${BARREL_HEIGHT}px] border-gray-800 ${isMarketPlaceClass}`}
        >
          <div className="relative h-[430px] w-full overflow-hidden rounded-tl-[30px] rounded-tr-[30px]">
            <div className="overflow-hidden relative w-full h-full flex justify-center items-center">
              <Image
                className={`w-full h-full rounded-tl-[30px] rounded-tr-[30px]  object-cover`}
                src={defaultImage ? DEFAULT_IMAGE : mainImage}
                alt="New NFT"
                width={300}
                height={450}
                priority
              />
            </div>
          </div>
          <div className="relative h-[260px] w-full">
            <div className="absolute bottom-0 py-4 w-full h-full">
              <div className={`flex-1 flex flex-col h-full justify-between`}>
                <div className="flex flex-col justify-between w-full h-full px-4">
                  <div>
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
                    <h3 className="text-xl font-rale text-white font-semibold">
                      {isProfileMeta?.name}
                    </h3>
                  </div>
                  <div className="flex flex-row flex-wrap  justify-start items-center">
                    <div className="flex items-center">
                      <p className="text-cask-chain text-[12px]">
                        {isProfileMeta.attributes.liquor?.toUpperCase()}
                      </p>
                      <p className="text-cask-chain px-1">{' · '}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-cask-chain text-[12px]">
                        {isProfileMeta.attributes.distillery?.toUpperCase()}
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
                        {isProfileMeta.attributes.region?.toUpperCase()}
                      </p>
                      <p className="text-cask-chain px-1">{' · '}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-cask-chain text-[12px]">
                        {isProfileMeta.attributes.cask_wood?.toUpperCase()}
                      </p>
                      <p className="text-cask-chain px-1">{' · '}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-cask-chain text-[12px]">
                        {isProfileMeta.attributes.age?.toUpperCase()}
                        years
                      </p>
                      <p className="text-cask-chain px-1">{' · '}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-cask-chain text-[12px]">
                        {isProfileMeta.attributes.cask_size?.toUpperCase()}L
                      </p>
                      <p className="text-cask-chain px-1">{' · '}</p>
                    </div>
                    <p className="text-cask-chain text-[12px]">
                      {isProfileMeta.attributes.abv?.toUpperCase()}%
                    </p>
                  </div>
                </div>
                <div className="px-4 pt-4 pb-2">
                  <Button
                    onClick={() =>
                      router.push(`/cask/${item._id || item.tokenId}`)
                    }
                    fit={false}
                  >
                    Buy the barrel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BarrelOffer
