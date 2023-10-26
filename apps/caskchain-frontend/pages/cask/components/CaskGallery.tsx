import { useEffect, useState } from 'react'
import CaskIllustration from './CaskIllustration'
import { AssetType } from '../[caskId]'
import Image from 'next/image'
import { Spacer } from 'caskchain-ui'
import { ipfsImageParser } from 'caskchain-lib'

type CaskGalleryProps = {
  cask: any
}

const CaskGallery: React.FC<CaskGalleryProps> = ({ cask }) => {
  const [activeAsset, setActiveAsset] = useState<any>()
  const [activeType, setActiveType] = useState<AssetType>(AssetType.PINATA)

  useEffect(() => {
    if (!cask.isLoading) {
      setActiveAsset(cask?.data?.meta?.image)
    }
  }, [cask.isLoading, cask?.data?.meta?.image])

  if (!activeAsset) return null

  return (
    <div className="grid grid-cols-3 gap-10 col-span-3">
      <div className="col-span-1 w-full">
        <div className="flex flex-col w-full">
          <div
            onClick={() => {
              setActiveType(AssetType.PINATA)
              setActiveAsset(0)
            }}
            className={`${
              activeAsset === cask?.data?.meta?.image
                ? 'border-2 border-cask-chain'
                : ''
            } p-2 rounded-xl`}
          >
            <Image
              className={`object-contain rounded-xl w-full`}
              src={ipfsImageParser(activeAsset)}
              alt="New NFT"
              width={100}
              height={150}
              loading="lazy"
            />
          </div>
          <Spacer size="xs" />
          {cask?.data?.media?.map((asset: any) => (
            <>
              <div
                key={asset}
                onClick={() => {
                  setActiveType(asset.type)
                  setActiveAsset(asset.url)
                }}
                className={`${
                  activeAsset === asset.url ? 'border-2 border-cask-chain' : ''
                } p-2 rounded-xl`}
              >
                <Image
                  className={`object-contain rounded-3xl w-full`}
                  src={
                    asset?.type === 'pinata'
                      ? ipfsImageParser(asset?.thumb)
                      : asset?.thumb
                  }
                  alt="New NFT"
                  width={100}
                  height={250}
                />
              </div>
              <Spacer size="xs" />
            </>
          ))}
        </div>
      </div>
      <div className="col-span-2">
        <CaskIllustration src={activeAsset} activeType={activeType} />
      </div>
    </div>
  )
}

export default CaskGallery
