/* eslint-disable @next/next/no-img-element */

import type { NextPage } from 'next'
import { BaseLayout } from '@ui'

import { Nft } from '@_types/nft'
import { useOwnedNfts } from '@hooks/web3'

import { useRouter } from 'next/router'

import FractionBalances from '@ui/ntf/fractionBalance'
import { auth } from 'utils/auth'
import Spacer from '@ui/common/Spacer'
import Button from '@ui/common/Button'
import Image from 'next/image'
import { useGlobal } from '@providers/global'
import { addressSimplifier } from 'utils/addressSimplifier'
import Link from 'next/link'
import BarrelNft from '@ui/ntf/item/BarrelNft'

const tabs = [
  { name: 'Your Collection', href: '#', key: 'my-collection' },
  { name: 'My selection', href: '#', key: 'my-selection' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const getServerSideProps = (context: any) => auth(context, 'user')

const Profile: NextPage = () => {
  const {
    state: { user },
  } = useGlobal()
  const { nfts } = useOwnedNfts()
  const router = useRouter()

  const _selectedTab = (router.query.tab as string) ?? 'my-collection'
  const selectedIndex = tabs.map((t) => t.key).indexOf(_selectedTab) ?? 0

  return (
    <BaseLayout background="bg-gradient-to-r from-[#0F0F0F] via-[#161616] to-[#000000]">
      <div className="py-16 pt-40 px-2 sm:px-6 lg:w-3/4">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex space-x-4 items-stretch">
            <main className="flex-1 overflow-y-auto">
              <div className="mx-auto">
                <div className="flex flex-col">
                  <Image
                    src="/images/nft.png"
                    width={300}
                    height={300}
                    alt="profile"
                    className="rounded-full object-cover w-60 h-60"
                  />
                  <Spacer size="md" />
                  <h2 className="tracking-tight font-extrabold text-gray-100 font-rale sm:text-4xl">
                    {user?.nickname}
                  </h2>
                  <p className="font-poppins text-xl text-gray-300">
                    {addressSimplifier(user?.address)}
                  </p>
                </div>
                <Spacer size="3xl" />
                <div className="mt-3 sm:mt-2">
                  <div className="hidden sm:block">
                    <div className="flex items-center ">
                      <nav
                        className=" -mb-px flex space-x-6 xl:space-x-8 border-b border-gray-600 w-full"
                        aria-label="Tabs"
                      >
                        {tabs.map((tab, index) => (
                          <a
                            onClick={() =>
                              router.replace(`/profile/${tab.key}`, undefined, {
                                shallow: true,
                              })
                            }
                            key={tab.name}
                            aria-current={
                              selectedIndex === index ? 'page' : undefined
                            }
                            className={classNames(
                              selectedIndex === index
                                ? 'border-cask-chain text-cask-chain'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                              'whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-2xl cursor-pointer'
                            )}
                          >
                            {tab.name}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>

                {_selectedTab === 'my-collection' && (
                  <section
                    className="mt-8 pb-16"
                    aria-labelledby="gallery-heading"
                  >
                    {nfts.data.length ? (
                      <>
                        <ul
                          role="list"
                          className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 px-4"
                        >
                          {(nfts?.data as Nft[])?.map((nft) => (
                            <li
                              key={nft.meta.name}
                              onClick={() => {
                                nfts.setIsApproved(false)
                                nfts.handleActiveNft(nft)
                              }}
                              className="relative"
                            >
                              <div
                                className={classNames(
                                  nft.tokenId === nfts.activeNft?.tokenId
                                    ? 'ring-2 ring-offset-2 ring-cask-chain'
                                    : 'focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-cask-chain',
                                  'group block w-full aspect-w-10 aspect-h-7 rounded-lg py-3 overflow-hidden'
                                )}
                              >
                                <Image
                                  width={300}
                                  height={100}
                                  src={'/images/nft.png'}
                                  alt=""
                                  className={classNames(
                                    nft.tokenId === nfts.activeNft?.tokenId
                                      ? ''
                                      : 'group-hover:opacity-75',
                                    'object-cover pointer-events-none h-40 w-full'
                                  )}
                                />
                                <button
                                  type="button"
                                  className="absolute inset-0 focus:outline-none"
                                >
                                  <span className="sr-only">
                                    View details for {nft.meta.name}
                                  </span>
                                </button>
                              </div>
                              <p className="mt-3 block text-lg font-medium text-gray-100 truncate pointer-events-none">
                                {nft.meta.name}
                              </p>
                            </li>
                          ))}
                        </ul>
                        <Spacer size="xl" />
                        {/* <div className="w-full border-b border-gray-700" /> */}
                        <Spacer size="xl" />
                      </>
                    ) : (
                      <div className="flex flex-col border border-gray-700 p-6 rounded-lg justify-center items-center">
                        <h3 className="font-poppins text-2xl text-gray-300">
                          No se ha encontrado ningna barrica
                        </h3>
                        <Spacer size="md" />
                        <Button onClick={() => router.push('/marketplace')}>
                          Ir al marketplace
                        </Button>
                      </div>
                    )}
                  </section>
                )}
                {_selectedTab === 'my-selection' && (
                  <section
                    className="mt-8 pb-16 px-4 flex flex-row flex-wrap justify-start space-x-6"
                    aria-labelledby="gallery-heading"
                  >
                    <>
                      {nfts?.favorites?.map((nft: Nft) => (
                        <Link key={nft.tokenId} href={`/cask/${nft.tokenId}`}>
                          <BarrelNft isMarketPlace item={nft} blow />
                        </Link>
                      ))}
                    </>
                  </section>
                )}
                {_selectedTab === 'fractions' && (
                  <section
                    className="mt-8 pb-16 px-4"
                    aria-labelledby="gallery-heading"
                  >
                    <FractionBalances
                      balances={nfts.dataBalances}
                      onRedeem={nfts.redeemFractions}
                    />
                  </section>
                )}
              </div>
            </main>
            {/* Details sidebar */}
            {nfts.activeNft && (
              <aside className="hidden w-96 bg-black-light rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90 p-8 mt-10 mr-8 border border-slate-500 overflow-y-auto lg:block">
                <div>
                  <div>
                    <div>
                      <div className="block w-full aspect-w-10 aspect-h-7 rounded-lg overflow-hidden">
                        <Image
                          width={350}
                          height={50}
                          src={'/images/nft.png'}
                          alt=""
                          className="object-cover w-full"
                        />
                      </div>
                      <div className="mt-4 flex items-start justify-between">
                        <div className="flex flex-col space-y-3">
                          <h2 className="text-lg font-medium text-cask-chain">
                            <span className="sr-only">Details for </span>
                            {nfts.activeNft.meta.name}
                          </h2>
                          <p className="text-sm font-medium text-gray-200">
                            {nfts.activeNft.meta.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-100">Stats</h3>
                      <dl className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
                        {nfts.activeNft.meta.attributes.map((attr: any) => (
                          <div
                            key={attr.trait_type}
                            className="py-3 flex justify-between text-sm font-medium"
                          >
                            <dt className="text-gray-100">
                              {attr.trait_type.toUpperCase()}:{' '}
                            </dt>
                            <dd className="text-cask-chain text-right">
                              {attr.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                    <Spacer size="md" />
                    <div className="flex flex-grow flex-col">
                      <div className="flex justify-end">
                        <Button
                          onClick={() =>
                            nfts.approveSell(nfts.activeNft.tokenId)
                          }
                        >
                          Approve sell
                        </Button>
                      </div>
                      <Spacer size="md" />
                      <input
                        min={0}
                        value={nfts.listPrice || 0}
                        disabled={!nfts.isApproved}
                        onChange={(e) => nfts.setListPrice(e.target.value)}
                        type="number"
                        id="first_name"
                        className="w-full bg-transparent border-b  text-5xl text-gray-100 focus:ring-0 rounded-lg "
                        required
                      />
                      <Spacer size="md" />
                      <Button
                        fit={false}
                        onClick={() => nfts.listNft(nfts.activeNft.tokenId)}
                        disabled={!nfts.isApproved}
                      >
                        List Nft
                      </Button>
                      {/* <button
                        disabled={activeNft.isListed}
                        onClick={() => {
                          nfts.listNft(activeNft.tokenId, activeNft.price)
                        }}
                        type="button"
                        className="disabled:text-gray-400 disabled:cursor-not-allowed flex-1 ml-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {activeNft.isListed ? 'Nft is listed' : 'List Nft'}
                      </button> */}
                    </div>
                    {/* <button
                      onClick={() =>
                        orderBottle(2, activeNft.tokenId, activeNft.tokenURI)
                      }
                      type="button"
                      className="disabled:text-gray-400 disabled:cursor-not-allowed flex-1 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Order two bottles
                    </button> */}
                  </div>
                  {/* {activeOffer && activeNft && (
                    <div>
                      <p className="mb-1">You have an offer!</p>
                      <p className="mb-2">
                        Offer:{' '}
                        {ethers.utils.formatEther(activeNft?.offer?.highestBid)}{' '}
                        ETH
                      </p>
                      <button
                        onClick={() => nfts.acceptOffer(activeNft.tokenId)}
                        type="button"
                        className="flex-1 bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Accept offer
                      </button>
                    </div>
                  )} */}
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}

export default Profile
