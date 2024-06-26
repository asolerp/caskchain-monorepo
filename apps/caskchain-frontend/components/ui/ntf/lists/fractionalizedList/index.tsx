import FractionalizedNftItem from '@ui/ntf/item/FractionalizedNft'

import { Nft } from '@_types/nft'
import Link from 'next/link'
import { useFractionalizedNfts } from '@hooks/web3/useFractionalizedNfts'

const FractionalizedNftList: React.FC = () => {
  const { data } = useFractionalizedNfts()

  return (
    <div>
      <p className="text-4xl mt-12 mb-8 font-semibold text-amber-300">
        Fractionalized Casks
      </p>
      <div className="flex flex-row space-x-6 mt-6 max-w-lg">
        {data?.map((nft: Nft) => (
          <Link key={nft.meta.image} passHref href={`/cask/${nft.tokenId}`}>
            <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
              <FractionalizedNftItem item={nft} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default FractionalizedNftList
