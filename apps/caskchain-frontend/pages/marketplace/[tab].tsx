import { useAccount, useAllNfts } from '@hooks/web3'
import { BaseLayout } from '@ui'

import BarrelNft from '@ui/ntf/item/BarrelNft'
import { Nft } from '@_types/nft'
import { NextPage } from 'next'
import FlatList from 'flatlist-react'
import { getCookie } from 'cookies-next'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useGlobal } from '@providers/global'
import Button from '@ui/common/Button'
import Spacer from '@ui/common/Spacer'
import BarrelsSkeleton from 'components/pages/marketplace/BarrelsSkeleton'
import Header from '@ui/layout/Header'
import Image from 'next/image'
import { LiquorsTypes } from 'caskchain-lib'
import LiquorFilter from 'components/pages/marketplace/LiquorFilter'

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
  const token = getCookie('token') as string
  const { nfts } = useAllNfts()
  const { account } = useAccount()
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
    const filtered = nfts?.data?.documents?.filter((nft: Nft) => {
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
  }, [_selectedTab, nfts?.data?.documents])

  if (!router.isReady) {
    return null
  }

  return (
    <BaseLayout background="bg-gradient-to-r from-[#0F0F0F] via-[#161616] to-[#000000]">
      <Header>
        <h1 className="font-rale font-semibold text-6xl text-cask-chain mb-10">
          Market <span className="text-white">Place</span>
        </h1>
      </Header>
      <div className="pb-16 sm:px-6 pt-20 w-3/4 px-4">
        <section className="flex flex-row justify-center space-x-5 ">
          <LiquorFilter
            liquor={LiquorsTypes.BRANDY}
            active={nfts.activeFilter === LiquorsTypes.BRANDY}
            onClick={() => nfts.handleActiveFilter(LiquorsTypes.BRANDY)}
          />
          <LiquorFilter
            liquor={LiquorsTypes.RUM}
            active={nfts.activeFilter === LiquorsTypes.RUM}
            onClick={() => nfts.handleActiveFilter(LiquorsTypes.RUM)}
          />
          <LiquorFilter
            liquor={LiquorsTypes.TEQUILA}
            active={nfts.activeFilter === LiquorsTypes.TEQUILA}
            onClick={() => nfts.handleActiveFilter(LiquorsTypes.TEQUILA)}
          />
          <LiquorFilter
            liquor={LiquorsTypes.WHISKEY}
            active={nfts.activeFilter === LiquorsTypes.WHISKEY}
            onClick={() => nfts.handleActiveFilter(LiquorsTypes.WHISKEY)}
          />
        </section>
        <Spacer size="xl" />
        <Spacer size="xl" />
        <section>
          <div tabindex="0" className="relative">
            <Image
              onClick={() => nfts.handleSearch()}
              src="/icons/search.svg"
              width={40}
              height={40}
              alt="search"
              className="absolute top-1/2 -translate-y-1/2 ml-8 cursor-pointer"
            />
            <input
              type="text"
              value={nfts.name}
              onChange={nfts.handleSearchInputChange}
              className="pl-20 bg-transparent border border-gray-600 rounded-2xl  focus:border-0 w-full h-20 font-poppins text-white text-xl ml-4"
              placeholder="Search by Collection, NFT name, Cellar, etc"
            ></input>
          </div>
        </section>
        <Spacer size="xl" />
        <Spacer size="xl" />
        <Spacer size="xl" />
        {/* <div className="flex flex-row space-x-6 mt-14">
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
        </div> */}
        <section>
          <div className="grid grid-cols-4 gap-x-5 gap-y-4 flex-wrap mx-auto lg:max-w-none">
            <>
              {nfts.isCustomLoading ? (
                <BarrelsSkeleton />
              ) : (
                <>
                  <FlatList
                    list={filteredNfts}
                    renderItem={(nft: Nft) => (
                      <>
                        <div key={nft?.tokenId} className="felx">
                          <BarrelNft
                            isMarketPlace
                            item={nft}
                            onPressFavorite={(nftId: string) =>
                              nfts.handleAddFavorite(nftId)
                            }
                            showFavorite={
                              token && user?.email && account.isConnected
                            }
                            isFavorite={hasFavorite(nft?.tokenId)}
                            blow
                          />
                        </div>
                      </>
                    )}
                    renderWhenEmpty={() => {
                      return (
                        <>
                          {/* {!nfts.isLoading && !nfts.isValidating && ( */}
                          <div className="col-span-4 flex flex-col border border-gray-700 p-6 rounded-lg justify-center items-center">
                            <h3 className="font-poppins text-2xl text-gray-300">
                              No se ha encontrado ningna barrica
                            </h3>
                          </div>
                          {/* )} */}
                        </>
                      )
                    }}
                  />
                  {nfts.isValidating && <BarrelsSkeleton />}
                </>
              )}
            </>
          </div>
        </section>
        <Spacer size="xl" />
        <section className="flex justify-center">
          <Button active={false} onClick={() => nfts.fetchMoreBarrels()}>
            Load more
          </Button>
        </section>
      </div>
    </BaseLayout>
  )
}

export default NFTCaskWorld
