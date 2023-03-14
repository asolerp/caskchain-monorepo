/* eslint-disable @next/next/no-img-element */

import type { NextPage } from 'next'
import { BaseLayout } from '@ui'

import { Nft } from '@_types/nft'
import { useOwnedNfts } from '@hooks/web3'

import TransactionsHistory from '@ui/ntf/transactionsHistory'
import withAuth from 'components/hoc/withAuth'
import { ethers } from 'ethers'
import { useState } from 'react'
import FractionBalances from '@ui/ntf/fractionBalance'
import { auth } from 'utils/auth'

const tabs = [
  { name: 'Your Collection', href: '#', key: 'collection' },
  { name: 'Your Fractions', href: '#', key: 'fractions' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const getServerSideProps = (context: any) => auth(context)

const Profile: NextPage = () => {
  const { nfts } = useOwnedNfts()
  const [activeTab, setActiveTab] = useState('collection')

  // const orderBottle = async () =>
  //   // numberOfBottles: number,
  //   // tokenId: number,
  //   // tokenURI: string
  //   {
  //     try {
  //       // const { address, signature } = await getSignedData(
  //       //   provider,
  //       //   account.data as string
  //       // )
  //       // const res = await axios.post(
  //       //   '/order-bottle',
  //       //   {
  //       //     address,
  //       //     signature,
  //       //     extractions: numberOfBottles,
  //       //     tokenURI,
  //       //   },
  //       //   { withCredentials: true }
  //       // )
  //       // const data = res.data as PinataRes
  //       // const newTokenURI = `${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`
  //       // const tx = await contract?.orderBottle(
  //       //   numberOfBottles,
  //       //   tokenId,
  //       //   newTokenURI,
  //       //   {
  //       //     value: ethers.utils.parseEther(String(bottlePrice * numberOfBottles)),
  //       //   }
  //       // )
  //       // await toast.promise(tx!.wait(), {
  //       //   pending: 'Uploading metadata',
  //       //   success: 'Metadata uploaded',
  //       //   error: 'Metadata upload error',
  //       // })
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     } catch (e: any) {
  //       console.error(e.message)
  //     }
  //   }

  return (
    <BaseLayout>
      <div className="py-16 sm:px-6 lg:px-8 px-4">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex space-x-4 items-stretch">
            <main className="flex-1 overflow-y-auto">
              <div className="pt-8 mx-auto">
                <div className="flex">
                  <h2 className="tracking-tight font-extrabold text-gray-100 sm:text-8xl">
                    YOUR NFTS
                  </h2>
                </div>
                <div className="mt-3 sm:mt-2">
                  <div className="hidden sm:block">
                    <div className="flex items-center ">
                      <nav
                        className=" -mb-px flex space-x-6 xl:space-x-8"
                        aria-label="Tabs"
                      >
                        {tabs.map((tab) => (
                          <a
                            onClick={() => setActiveTab(tab.key)}
                            key={tab.name}
                            href={tab.href}
                            aria-current={
                              tab.key === activeTab ? 'page' : undefined
                            }
                            className={classNames(
                              tab.key === activeTab
                                ? 'border-amber-300 text-amber-300'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg'
                            )}
                          >
                            {tab.name.toUpperCase()}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>

                {activeTab === 'collection' && (
                  <section
                    className="mt-8 pb-16 px-4"
                    aria-labelledby="gallery-heading"
                  >
                    <ul
                      role="list"
                      className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
                    >
                      {(nfts.data as Nft[])?.map((nft) => (
                        <li
                          key={nft.meta.name}
                          onClick={() => {
                            nfts.setIsApproved(false)
                            nfts.setActiveNft(nft)
                          }}
                          className="relative"
                        >
                          <div
                            className={classNames(
                              nft.tokenId === nfts.activeNft?.tokenId
                                ? 'ring-2 ring-offset-2 ring-amber-300'
                                : 'focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-amber-300',
                              'group block w-full aspect-w-10 aspect-h-7 rounded-lg py-3 overflow-hidden'
                            )}
                          >
                            <img
                              src={'/images/cask_2.png'}
                              alt=""
                              className={classNames(
                                nft.tokenId === nfts.activeNft?.tokenId
                                  ? ''
                                  : 'group-hover:opacity-75',
                                'object-contain pointer-events-none h-40 w-full'
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
                    {nfts.activeNft && (
                      <div>
                        <TransactionsHistory
                          transactions={nfts.activeNft?.transactions}
                        />
                        {nfts.activeNft?.offer && (
                          <div className="sm:px-6 lg:px-8 mt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                              Received Offers
                            </h3>

                            <div
                              key={nfts.activeNft?.offer?.bidder}
                              className="flex flex-row justify-between items-center w-3/4 mb-2"
                            >
                              <div>
                                <h3 className="font-medium">Bidder</h3>
                                <p>{nfts.activeNft?.offer?.highestBidder}</p>
                              </div>
                              <div>
                                <h3 className="font-medium">Bid</h3>
                                <p>
                                  {nfts.activeNft?.offer?.bid &&
                                    ethers.utils.formatEther(
                                      nfts.activeNft?.offer?.bid
                                    )}{' '}
                                  ETH
                                </p>
                              </div>
                              <div>
                                <button
                                  onClick={() =>
                                    nfts.acceptOffer(nfts.activeNft.tokenId)
                                  }
                                  type="button"
                                  className=" bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  Accept Offer
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </section>
                )}
                {activeTab === 'fractions' && (
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
              <aside className="hidden w-96 bg-slate-800 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-90 p-8 mt-10 mr-8 border border-slate-500 overflow-y-auto lg:block">
                <div>
                  <div className="space-y-6">
                    <div>
                      <div className="block w-full aspect-w-10 aspect-h-7 rounded-lg overflow-hidden">
                        <img
                          src={'/images/cask_2.png'}
                          alt=""
                          className="object-cover"
                        />
                      </div>
                      <div className="mt-4 flex items-start justify-between">
                        <div className="flex flex-col space-y-3">
                          <h2 className="text-lg font-medium text-amber-300">
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
                            <dd className="text-amber-300 text-right">
                              {attr.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>

                    <div className="flex flex-grow flex-col space-y-4">
                      <button
                        onClick={() => nfts.approveSell(nfts.activeNft.tokenId)}
                        type="button"
                        className=" bg-emerald-400 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semiBold text-white "
                      >
                        APPROVE SELL
                      </button>
                      <input
                        min={0}
                        value={nfts.listPrice || 0}
                        disabled={!nfts.isApproved}
                        onChange={(e) => nfts.setListPrice(e.target.value)}
                        type="number"
                        id="first_name"
                        className="w-full bg-transparent border-b mt-2 text-5xl text-gray-100 focus:ring-0 rounded-lg "
                        required
                      />
                      <button
                        onClick={() => nfts.listNft(nfts.activeNft.tokenId)}
                        disabled={!nfts.isApproved}
                        type="button"
                        className=" bg-emerald-400 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semiBold text-white disabled:opacity-100 disabled:bg-slate-200 disabled:text-gray-800"
                      >
                        PUT ON SALE
                      </button>
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
