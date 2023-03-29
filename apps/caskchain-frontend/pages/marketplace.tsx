import { useAllNfts } from '@hooks/web3'
import { BaseLayout } from '@ui'
import Filter from '@ui/common/Filter'
import Spinner from '@ui/common/Spinner'
import BarrelNft from '@ui/ntf/item/BarrelNft'
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
    if (filter === 'onSale' && nft?.price) {
      return nft?.price > 0
    }
    if (filter === 'fractionized') {
      return nft?.fractions?.total > 0
    }
  })

  return (
    <BaseLayout background="bg-gradient-to-r from-[#0F0F0F] via-[#161616] to-[#000000]">
      <div className="py-16 sm:px-6 pt-40 lg:px-32 px-4">
        <h2 className="tracking-tight font-extrabold text-gray-100 font-rale sm:text-8xl">
          Marketplace
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
          {nfts.isLoading ? (
            <Spinner color="white" />
          ) : (
            <div className="flex flex-row space-x-6 flex-wrap mx-auto lg:max-w-none">
              {filteredNfts?.length === 0 ? (
                <div>
                  <h3>There is not casks at the moment</h3>
                </div>
              ) : (
                <>
                  {filteredNfts?.map((nft: Nft) => (
                    <Link key={nft.tokenId} href={`/cask/${nft.tokenId}`}>
                      <BarrelNft isMarketPlace item={nft} blow />
                    </Link>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </BaseLayout>
  )
}

export default NFTCaskWorld
