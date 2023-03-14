import { useAllNfts } from '@hooks/web3'
import { BaseLayout } from '@ui'
import Filter from '@ui/common/Filter'
import GeneralNftInfo from '@ui/ntf/item/GeneralNftInfo'
import { Nft } from '@_types/nft'
import { NextPage } from 'next'
import Link from 'next/link'
import { useState } from 'react'

const NFTCaskWorld: NextPage = () => {
  const { nfts } = useAllNfts()
  const [filter, setFilter] = useState('all')

  const filteredNfts = nfts?.data?.filter((nft: Nft) => {
    if (filter === 'all') {
      return true
    }
    if (filter === 'onSale') {
      return nft?.price > 0
    }
    if (filter === 'fractionized') {
      return nft?.fractions?.total > 0
    }
  })

  return (
    <BaseLayout>
      <div className="py-16 sm:px-6 pt-40 lg:px-20 px-4">
        <h2 className="tracking-tight font-extrabold text-gray-100 sm:text-8xl">
          MARKETPLACE
        </h2>
        <div className="flex flex-row space-x-6 mt-14">
          <Filter
            name="ALL CASKS"
            active={filter === 'all'}
            onPress={() => setFilter('all')}
          />
          <Filter
            name="ON SALE"
            active={filter === 'onSale'}
            onPress={() => setFilter('onSale')}
          />
          <Filter
            name="FRACTIONIZED CASKS"
            active={filter === 'fractionized'}
            onPress={() => setFilter('fractionized')}
          />
        </div>
        <div className="mx-auto mt-20">
          <div className="flex flex-row space-x-6 flex-wrap mx-auto lg:max-w-none">
            {filteredNfts?.map((nft: Nft) => (
              <Link key={nft.tokenId} href={`/cask/${nft.tokenId}`}>
                <GeneralNftInfo isMarketPlace item={nft} blow />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}

export default NFTCaskWorld
