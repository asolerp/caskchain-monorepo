import { useAllNfts } from '@hooks/web3'
import { BaseLayout } from '@ui'

import BarrelNft from '@ui/ntf/item/BarrelNft'
import { Nft } from '@_types/nft'
import { NextPage } from 'next'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useGlobal } from '@providers/global'

const tabs = [
  { name: 'All barrels', href: '#', key: 'search' },
  { name: 'On sale', href: '#', key: 'on-sale' },
  { name: 'Fractionized', href: '#', key: 'fractionized' },
  // { name: 'Your Fractions', href: '#', key: 'fractions' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const NFTCaskWorld: NextPage = () => {
  const { nfts } = useAllNfts()
  const {
    state: { user },
  } = useGlobal()
  const router = useRouter()
  const _selectedTab = (router.query.tab as string) ?? 'search'
  const selectedIndex = tabs.map((t) => t.key).indexOf(_selectedTab) ?? 0
  const [filteredNfts, setFilteredNfts] = useState(nfts?.data)

  const hasFavorite = (nftId: number) => {
    return user?.favorites?.[nftId]
  }

  useEffect(() => {
    const filtered = nfts?.data?.filter((nft: Nft) => {
      if (_selectedTab === 'search') {
        return true
      }
      if (_selectedTab === 'on-sale' && nft?.price) {
        return nft?.price > 0
      }
      if (_selectedTab === 'fractionized') {
        return nft?.fractions?.total > 0
      }
    })
    setFilteredNfts(filtered)
  }, [_selectedTab, nfts?.data])

  if (!router.isReady) {
    return null
  }

  return (
    <BaseLayout background="bg-gradient-to-r from-[#0F0F0F] via-[#161616] to-[#000000]">
      <div className="py-16 sm:px-6 pt-40 w-3/4  px-4">
        <h2 className="tracking-tight font-extrabold text-gray-100 font-rale sm:text-6xl">
          Marketplace
        </h2>
        <div className="flex flex-row space-x-6 mt-14">
          <nav
            className=" -mb-px flex space-x-6 xl:space-x-8  w-full"
            aria-label="Tabs"
          >
            {tabs.map((tab, index) => (
              <a
                onClick={() =>
                  router.replace(`/marketplace/${tab.key}`, undefined, {
                    shallow: true,
                  })
                }
                key={tab.name}
                aria-current={selectedIndex === index ? 'page' : undefined}
                className={classNames(
                  selectedIndex === index
                    ? ' text-cask-chain'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap pb-2 px-1 font-medium text-2xl cursor-pointer'
                )}
              >
                {tab.name}
                {selectedIndex === index && (
                  <motion.div
                    layoutId="underline"
                    className="border-b-2 border-cask-chain"
                  />
                )}
              </a>
            ))}
          </nav>
        </div>
        <div className="mx-auto mt-20">
          <div className="flex flex-row space-x-6 flex-wrap mx-auto lg:max-w-none">
            {filteredNfts?.length ? (
              <>
                {filteredNfts?.map((nft: Nft) => (
                  // <Link key={nft.tokenId} href={`/cask/${nft.tokenId}`}>
                  <BarrelNft
                    key={nft?.tokenId}
                    isMarketPlace
                    item={nft}
                    onPressFavorite={(nftId: string) =>
                      nfts.handleAddFavorite(nftId)
                    }
                    isFavorite={hasFavorite(nft?.tokenId)}
                    blow
                  />
                  // </Link>
                ))}
              </>
            ) : (
              <div className="w-full flex flex-col border border-gray-700 p-6 rounded-lg justify-center items-center">
                <h3 className="font-poppins text-2xl text-gray-300">
                  No se ha encontrado ningna barrica
                </h3>
              </div>
            )}

            {/* {filteredNfts?.length === 0 ? (
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
            )} */}
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}

export default NFTCaskWorld
