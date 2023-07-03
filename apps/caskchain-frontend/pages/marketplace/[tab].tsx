import { useAccount, useAllNfts } from '@hooks/web3'
import { BaseLayout } from '@ui'
import { Chip } from 'caskchain-ui'
import BarrelNft from '@ui/ntf/item/BarrelNft'
import { Nft } from '@_types/nft'
import { NextPage } from 'next'
import FlatList from 'flatlist-react'
import { getCookie } from 'cookies-next'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { useGlobal } from '@providers/global'
import Button from '@ui/common/Button'
import Spacer from '@ui/common/Spacer'
import BarrelsSkeleton from 'components/pages/marketplace/BarrelsSkeleton'
import Header from '@ui/layout/Header'
import Image from 'next/image'
import { LiquorsTypes, upperCaseFirstLetter } from 'caskchain-lib'
import LiquorFilter from 'components/pages/marketplace/LiquorFilter'
import useLocalLoading from '@hooks/common/useLocalLoading'
import BarrelsSection from 'components/pages/home/BarrelsSection'
import Dropdown from '@ui/common/Dropdown'
import FilterMarketplace from 'components/pages/marketplace/FilterMarketplace'
import { filters, sufixesByType } from './utils/filters'

const NFTCaskWorld: NextPage = () => {
  const token = getCookie('token') as string
  const { nfts } = useAllNfts()
  const { account } = useAccount()
  const { loading } = useLocalLoading()
  const {
    state: { user },
  } = useGlobal()

  const router = useRouter()
  const _selectedTab = (router.query.tab as string) ?? 'search'
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

  const RandomBarrels = () => {
    return (
      <section className="bg-white">
        <Image
          src="/images/wave1.svg"
          width={1000}
          height={500}
          alt="wave"
          className="scale-y-110 scale-x-110 lg:scale-x-100 w-full"
        />
        <BarrelsSection />
      </section>
    )
  }

  return (
    <BaseLayout background="bg-black-light" bottomBanner={<RandomBarrels />}>
      <Header></Header>
      <Spacer size="xl" />
      {/* <div className="sm:px-6 w-3/4 px-4">
        <section className="flex flex-row justify-center space-x-5 ">
          <LiquorFilter
            liquor={LiquorsTypes.BRANDY}
            active={nfts.activeLiquor.includes(LiquorsTypes.BRANDY)}
            onClick={() => nfts.handleActiveLiquor(LiquorsTypes.BRANDY)}
          />
          <LiquorFilter
            liquor={LiquorsTypes.RUM}
            active={nfts.activeLiquor.includes(LiquorsTypes.RUM)}
            onClick={() => nfts.handleActiveLiquor(LiquorsTypes.RUM)}
          />
          <LiquorFilter
            liquor={LiquorsTypes.TEQUILA}
            active={nfts.activeLiquor.includes(LiquorsTypes.TEQUILA)}
            onClick={() => nfts.handleActiveLiquor(LiquorsTypes.TEQUILA)}
          />
          <LiquorFilter
            liquor={LiquorsTypes.WHISKEY}
            active={nfts.activeLiquor.includes(LiquorsTypes.WHISKEY)}
            onClick={() => nfts.handleActiveLiquor(LiquorsTypes.WHISKEY)}
          />
        </section>
      </div> */}
      {loading ? (
        <div className="flex flex-col justify-center items-center w-full h-screen"></div>
      ) : (
        <div className="sm:px-6 pt-10 w-3/4 px-4">
          <section>
            <div className="grid grid-cols-8 items-center">
              <div className="col-span-2">
                <div className="flex flex-row items-center justify-around mr-10">
                  <Dropdown
                    label="Sort By"
                    items={[
                      { label: 'Age', key: 'age' },
                      { label: 'ABV', key: 'abv' },
                    ]}
                    active={nfts.activeSort}
                    onClick={(item: any) => nfts.setActiveSort(item.label)}
                  />
                  <Dropdown
                    label="Order By"
                    items={[
                      { label: nfts.mapSortDirection['asc'], key: 'asc' },
                      { label: nfts.mapSortDirection['desc'], key: 'desc' },
                    ]}
                    active={nfts.mapSortDirection[nfts.sortDirection]}
                    onClick={(item: any) => nfts.setSortDirection(item.key)}
                  />
                </div>
              </div>
              <div
                tabIndex={0}
                className="relative col-span-4 bg-[#292929] rounded-2xl"
              >
                <Image
                  onClick={() => nfts.handleSearch()}
                  src="/icons/search.svg"
                  width={30}
                  height={30}
                  alt="search"
                  className="absolute top-1/2 -translate-y-1/2 ml-8 cursor-pointer w-8 h-8"
                />
                <input
                  type="text"
                  value={nfts.name}
                  onChange={nfts.handleSearchInputChange}
                  className="pl-24 bg-transparent border border-gray-600 rounded-2xl  focus:border-0 w-full h-16 font-poppins text-white text-xl"
                  placeholder="Search by Collection, NFT name, Cellar, etc"
                ></input>
              </div>
              <div className="col-span-2" />
            </div>
          </section>
          <Spacer size="xl" />
          <section>
            <div className="flex flex-row justify-center flex-wrap space-x-2">
              {filters.map((filter) => (
                <div key={filter.icon}>
                  <FilterMarketplace
                    size={filter.size}
                    filter={filter.icon}
                    label={filter.label}
                    sufix={filter.sufix}
                    items={nfts.filterList || null}
                    onClick={() => nfts.handleSetFilterList(filter.name)}
                    onClickItem={(item: any) =>
                      nfts.handleSelectFilterOption(filter.name, item)
                    }
                  />
                  <Spacer size="sm" />
                </div>
              ))}
            </div>
          </section>
          <Spacer size="lg" />
          <section>
            {nfts.selectedFilters.length > 0 && (
              <>
                <div className="flex flex-row items-center">
                  {nfts.selectedFilters.length > 0 && (
                    <h2 className="font-poppins text-cask-chain mr-4">
                      Active Filters:
                    </h2>
                  )}
                  {nfts.selectedFilters.map((filter: any) => (
                    <div key={filter.type} className="flex flex-row">
                      {filter.value && (
                        <div className="flex flex-row">
                          {filter.value.map((item: any) => (
                            <Chip
                              key={item}
                              label={
                                upperCaseFirstLetter(item) +
                                `${
                                  sufixesByType?.[filter.type]
                                    ? sufixesByType?.[filter.type]
                                    : ''
                                }`
                              }
                              color="caskChain"
                              onClick={() =>
                                nfts.removeFilter(filter.type, item, () => {
                                  if (
                                    item === LiquorsTypes.TEQUILA ||
                                    item === LiquorsTypes.WHISKEY ||
                                    item === LiquorsTypes.RUM ||
                                    item === LiquorsTypes.BRANDY
                                  ) {
                                    nfts.handleActiveLiquor(item)
                                  }
                                })
                              }
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <Spacer size="xl" />
                </div>
                <Spacer size="lg" />
              </>
            )}
          </section>

          <section>
            <div className="grid grid-cols-4 gap-x-5 gap-y-4 flex-wrap mx-auto lg:max-w-none">
              <>
                {nfts.searchLoading ? (
                  <BarrelsSkeleton />
                ) : (
                  <>
                    <FlatList
                      list={filteredNfts}
                      renderItem={(nft: Nft, idx: string) => (
                        <div key={idx} className="felx">
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
                      )}
                      renderWhenEmpty={() => {
                        return (
                          <>
                            <div className="col-span-4 flex flex-col border border-gray-700 p-6 rounded-lg justify-center items-center">
                              <h3 className="font-poppins text-2xl text-gray-300">
                                No se ha encontrado ningna barrica
                              </h3>
                            </div>
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
          <section className="flex justify-center py-16">
            <Button active={false} onClick={() => nfts.fetchMoreBarrels()}>
              Load more
            </Button>
          </section>
        </div>
      )}
    </BaseLayout>
  )
}

export default NFTCaskWorld
