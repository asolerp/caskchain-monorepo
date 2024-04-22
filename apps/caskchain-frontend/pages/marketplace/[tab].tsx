import { BaseLayout } from '@ui'
import { Chip } from 'caskchain-ui'
import BarrelNft from '@ui/ntf/item/BarrelNft'
import { Nft } from '@_types/nft'
import { NextPage } from 'next'
import FlatList from 'flatlist-react'
import { getCookie } from 'cookies-next'

import { useRouter } from 'next/router'

import { useGlobal } from '@providers/global'
import Button from '@ui/common/Button'
import Spacer from '@ui/common/Spacer'
import BarrelsSkeleton from 'components/pages/marketplace/BarrelsSkeleton'
import Header from '@ui/layout/Header'
import Image from 'next/image'
import { LiquorsTypes, upperCaseFirstLetter } from 'caskchain-lib'

import useLocalLoading from '@hooks/common/useLocalLoading'

import Dropdown from '@ui/common/Dropdown'
import { sufixesByType } from '../../utils/filters'
import useGetRates from '@hooks/common/useGetRates'
import { useAllNfts } from '@hooks/web3/useAllNfts'

const NFTCaskWorld: NextPage = () => {
  const token = getCookie('token') as string
  const {
    data,
    refetch,
    isLoading,
    activeSort,
    hasNextPage,
    removeFilter,
    isValidating,
    handleChange,
    fetchNextPage,
    sortDirection,
    setActiveSort,
    selectedFilters,
    mapSortDirection,
    setSortDirection,
    handleAddFavorite,
    handleActiveLiquor,
  } = useAllNfts()
  const { rates } = useGetRates()
  const { loading } = useLocalLoading()
  const {
    state: { user },
  } = useGlobal()

  const router = useRouter()
  // const _selectedTab = (router.query.tab as string) ?? 'search'
  // const [filteredNfts, setFilteredNfts] = useState(nfts?.data)

  const hasFavorite = (nftId: number) => {
    return user?.favorites?.[nftId]
  }

  // useEffect(() => {
  //   const filtered = nfts?.data?.filter((nft: Nft) => {
  //     if (_selectedTab === 'search') {
  //       return true
  //     }
  //     if (_selectedTab === 'on-sale' && nft?.price) {
  //       return nft?.price > 0
  //     }
  //     if (_selectedTab === 'fractionized') {
  //       return nft?.fractions?.total > 0
  //     }
  //   })
  //   setFilteredNfts(filtered)
  // }, [_selectedTab, nfts?.data])

  if (!router.isReady) {
    return null
  }

  return (
    <BaseLayout background="bg-black-light" withFooter={false}>
      <Header></Header>
      <Spacer size="xl" />
      {loading ? (
        <div className="flex flex-col justify-center items-center w-full h-screen"></div>
      ) : (
        <div className="sm:px-6 lg:pt-10 lg:w-3/4 px-4">
          <section>
            <div className="flex flex-col lg:grid lg:grid-cols-8 items-center">
              <div className="lg:col-span-2 order-3">
                <div className="flex flex-row items-center lg:justify-around justify-center lg:mr-10">
                  <Dropdown
                    label="Sort By"
                    items={[
                      { label: 'Age', key: 'age' },
                      { label: 'ABV', key: 'abv' },
                    ]}
                    active={activeSort}
                    onClick={(item: any) => setActiveSort(item.label)}
                  />
                  <Dropdown
                    label="Order By"
                    items={[
                      { label: mapSortDirection['asc'], key: 'asc' },
                      { label: mapSortDirection['desc'], key: 'desc' },
                    ]}
                    active={mapSortDirection[sortDirection]}
                    onClick={(item: any) => setSortDirection(item.key)}
                  />
                </div>
              </div>
              <div
                tabIndex={0}
                className="w-full relative lg:col-span-4 lg:order-2 bg-[#292929] rounded-2xl lg:mb-0 mb-4"
              >
                <Image
                  onClick={() => refetch()}
                  src="/icons/search.svg"
                  width={30}
                  height={30}
                  alt="search"
                  className="absolute top-1/2 -translate-y-1/2 ml-8 cursor-pointer w-8 h-8"
                />
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  className="pl-24 bg-transparent border border-gray-600 rounded-2xl  focus:border-0 w-full h-16 font-poppins text-white text-xl"
                  placeholder="Search by Collection, NFT name, Cellar, etc"
                ></input>
              </div>
              <div className="lg:col-span-2" />
            </div>
          </section>
          <Spacer size="xl" />
          <section>
            {/* <div className="flex flex-row justify-center flex-wrap space-x-2">
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
            </div> */}
          </section>
          <Spacer size="lg" />
          {/* <section>
            {selectedFilters.length > 0 && (
              <>
                <div className="flex flex-row items-center">
                  {selectedFilters.length > 0 && (
                    <h2 className="font-poppins text-cask-chain mr-4">
                      Active Filters:
                    </h2>
                  )}
                  {selectedFilters.map((filter: any) => (
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
                                removeFilter(filter.type, item, () => {
                                  if (
                                    item === LiquorsTypes.TEQUILA ||
                                    item === LiquorsTypes.WHISKEY ||
                                    item === LiquorsTypes.RUM ||
                                    item === LiquorsTypes.BRANDY
                                  ) {
                                    handleActiveLiquor(item)
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
          </section> */}
          <section>
            <div className="lg:grid lg:grid-cols-4 lg:gap-x-5 lg:gap-y-4 lg:flex-wrap flex flex-col mx-auto lg:max-w-none">
              <>
                {isLoading ? (
                  <BarrelsSkeleton />
                ) : (
                  <>
                    <FlatList
                      list={(data as any)?.pages?.flatMap(
                        (page: any) => page.items
                      )}
                      renderItem={(nft: Nft, idx: string) => {
                        return (
                          <div key={idx} className="felx">
                            <BarrelNft
                              isMarketPlace
                              rates={rates}
                              item={nft}
                              onPressFavorite={(nftId: string) =>
                                handleAddFavorite(nftId)
                              }
                              showFavorite={token && user?.email}
                              isFavorite={hasFavorite(nft?.tokenId)}
                              blow
                            />
                          </div>
                        )
                      }}
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
                    {isValidating && <BarrelsSkeleton />}
                  </>
                )}
              </>
            </div>
          </section>
          <Spacer size="xl" />
          {hasNextPage && (
            <section className="flex justify-center py-16">
              <Button active={false} onClick={() => fetchNextPage()}>
                Load more
              </Button>
            </section>
          )}
        </div>
      )}
    </BaseLayout>
  )
}

export default NFTCaskWorld
