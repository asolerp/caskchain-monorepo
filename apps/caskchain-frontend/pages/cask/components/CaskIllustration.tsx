import { ipfsImageParser } from 'caskchain-lib'
import Image from 'next/image'
import { AssetType } from '../[caskId]'

const CaskIllustration = ({
  src,
  activeType,
}: {
  src: string
  activeType: AssetType
}) => {
  return (
    <div className="flex justify-center rounded-2xl">
      {activeType === AssetType.PINATA && (
        <Image
          className={`object-cover w-full h-full rounded-2xl`}
          src={ipfsImageParser(src)}
          alt="New NFT"
          width={350}
          height={400}
        />
      )}
      {activeType === AssetType.IMAGE && (
        <Image
          className={`object-cover w-full h-full rounded-2xl`}
          src={src}
          alt="New NFT"
          width={350}
          height={400}
        />
      )}
      {activeType === AssetType.VIDEO && (
        <video
          width={350}
          height={400}
          autoPlay={true}
          controls={false}
          className={`object-cover w-full h-full rounded-2xl`}
          src="https://res.cloudinary.com/enalbis/video/upload/v1681586853/CaskChain/flofru3viqsirclxlapx.mp4"
        />
      )}
    </div>
  )
}

export default CaskIllustration
