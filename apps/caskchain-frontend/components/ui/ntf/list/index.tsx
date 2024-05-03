import { Nft } from '@_types/nft'
import Link from 'next/link'

import GeneralNftInfo from '../item/GeneralNftInfo'
import { useListedNfts } from '@hooks/web3/useListedNfts'

const NftList: React.FC = () => {
  const { data } = useListedNfts()

  return (
    <div>
      <p className="text-4xl mt-12 mb-8 font-semibold text-amber-300">
        NFTs Casks
      </p>
      <div className="flex flex-row space-x-6 mt-6 max-w-lg">
        {data?.map((nft: Nft) => (
          <Link key={nft.meta.image} passHref href={`/cask/${nft.tokenId}`}>
            <div className="flex flex-col rounded-lg shadow-lg overflow-hidden">
              <GeneralNftInfo item={nft} blow />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default NftList
