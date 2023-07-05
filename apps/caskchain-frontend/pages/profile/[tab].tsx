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

import { ipfsImageParser } from 'utils/ipfsImageParser'
import Header from '@ui/layout/Header'
import { useState } from 'react'
import { Switch } from '@headlessui/react'

import ClientOnly from 'components/pages/ClientOnly'
import ListBarrelModal from '@ui/modals/ListBarrelModal'
import BarrelProfile from '@ui/ntf/item/BarrelProfile'

import useGetBalance from '@hooks/common/useGetBalance'
import { useOpenWallet } from '@hooks/common/useOpenWallet'

// type addressType = `0x${string}`

const tabs = [
  { name: 'My cellar', href: '#', key: 'my-collection' },
  { name: 'My selection', href: '#', key: 'my-selection' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const getServerSideProps = (context: any) => auth(context, 'user')

const Profile: NextPage = () => {
  const { nfts } = useOwnedNfts()
  const {
    state: { user, address },
  } = useGlobal()
  const { openWallet, loading } = useOpenWallet()
  const { balance } = useGetBalance()
  const router = useRouter()

  const [editMode, setEditMode] = useState(false)
  const [isListModalOpen, setIsListModalOpen] = useState(false)

  const _selectedTab = (router.query.tab as string) ?? 'my-collection'
  const selectedIndex = tabs.map((t) => t.key).indexOf(_selectedTab) ?? 0

  const [selectedBarrelId, setSelectedBarrelId] = useState<number | null>(null)

  return (
    <>
      <ListBarrelModal
        modalIsOpen={isListModalOpen}
        closeModal={() => setIsListModalOpen(false)}
        onList={(price: string) => nfts.listNft(selectedBarrelId, price)}
      />
      <BaseLayout background="bg-white">
        <Header>
          <h1 className="font-rale font-semibold text-6xl text-cask-chain mb-10">
            My <span className="text-white">Cellar</span>
          </h1>
        </Header>
        <div className="w-full">
          <main>
            <div>
              <ClientOnly>
                <div className="grid grid-cols-2 gap-10 px-40 py-20 bg-black-light">
                  <div className="flex justify-center items-center">
                    <div className="relative hover:opacity-40 cursor-pointer">
                      <Image
                        src="/images/avatar.png"
                        width={430}
                        height={430}
                        alt="profile"
                        className="rounded-full object-cover "
                      />
                      <Image
                        src="/icons/image.png"
                        width={150}
                        height={150}
                        alt="profile"
                        className="absolute object-cover z-40 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      />
                    </div>
                    <div className="px-10 -ml-20 flex flex-col items-center w-fit h-fit p-6 bg-gray-400 rounded-[30px] bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10">
                      <h3 className="font-rale font-medium text-white text-3xl text-center">
                        {user?.nickname ?? addressSimplifier(address as string)}
                      </h3>
                      <Spacer size="md" />
                      <p className="font-poppins text-white">
                        My Cellar:{' '}
                        <span className="text-cask-chain">
                          {' '}
                          {nfts?.data?.length}{' '}
                          {`NFT${nfts?.data?.length > 1 ? 's' : ''}`}
                        </span>
                      </p>
                      <Spacer size="lg" />
                      <p className="font-poppins text-white">
                        Balance:{' '}
                        <span className="text-cask-chain">
                          {' '}
                          {balance.substring(0, 7)} ETH
                        </span>
                      </p>
                      <Spacer size="lg" />
                      <Button
                        loading={loading}
                        onClick={openWallet}
                        containerStyle="absolute px-6 py-4 -bottom-6"
                        labelStyle="text-md"
                      >
                        Open wallet
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-center items-center h-full">
                    <div className="flex flex-col w-2/3 h-full">
                      <div className="flex flex-row items-center space-x-3 self-end mr-8">
                        <Switch
                          checked={editMode}
                          onChange={() => setEditMode(!editMode)}
                          className={`${
                            editMode ? 'bg-cask-chain' : 'bg-gray-300'
                          }
                    relative inline-flex flex-shrink-0 h-[28px] w-[54px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                        >
                          <span
                            aria-hidden="true"
                            className={`${
                              editMode ? 'translate-x-6' : 'translate-x-0'
                            }
                    pointer-events-none inline-block h-[24px] w-[24px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                          />
                        </Switch>
                        <span className="text-gray-400">EDIT</span>
                      </div>
                      <textarea
                        disabled={!editMode}
                        className="bg-transparent border-0 text-gray-400 text-xl w-full h-full focus:outline-none focus:border-cask-chain"
                        value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus malesuada massa vitae sapien vestibulum varius. Etiam tempus augue ac tellus congue molestie. Aliquam posuere facilisis aliquam. Maecenas a diam rhoncus mauris dapibus pellentesque eu nec lacus. Sed tempor ex a odio bibendum consectetur. Morbi nec aliquam neque, vitae feugiat eros. Fusce tristique at velit sed pulvinar. "
                      ></textarea>
                    </div>
                  </div>
                </div>
              </ClientOnly>
              <Image
                src="/images/wave1.svg"
                width={1000}
                height={500}
                alt="wave"
                className="w-full"
              />
              <Spacer size="3xl" />
              <div className="mt-3 sm:mt-2">
                <div className="hidden sm:block">
                  <div className="flex flex-row w-full">
                    <nav
                      className=" flex space-x-6 justify-center items-center xl:space-x-8 w-full"
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
                              ? 'border border-cask-chain bg-cask-chain text-black '
                              : 'border border-black text-black',
                            'whitespace-nowrap border-b-2 font-medium text-2xl cursor-pointer rounded-full py-4 px-4'
                          )}
                        >
                          {tab.name}
                        </a>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
              <Spacer size="xl" />
              {_selectedTab === 'my-collection' && (
                <section
                  className="mt-8 pb-16"
                  aria-labelledby="gallery-heading"
                >
                  {nfts.data.length ? (
                    <>
                      <ul role="list" className="grid grid-cols-7 gap-10">
                        <li className="relative col-span-1" />
                        <li className="grid grid-cols-3 gap-5 col-span-5">
                          {(nfts?.data as Nft[])?.map((nft) => (
                            <BarrelProfile
                              key={nft.tokenId}
                              onPressProfileCTA={() => {
                                setSelectedBarrelId(nft.tokenId)
                                setIsListModalOpen(true)
                              }}
                              item={nft}
                            />
                          ))}
                        </li>
                        <li className="relative col-span-1" />
                      </ul>
                      <Spacer size="xl" />
                    </>
                  ) : (
                    <div className="flex flex-col  p-6 rounded-lg justify-center items-center">
                      <h3 className="font-poppins text-2xl text-gray-500">
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
                  className="mt-8 pb-16"
                  aria-labelledby="gallery-heading"
                >
                  <ul role="list" className="grid grid-cols-7 gap-10">
                    <li className="relative col-span-1" />
                    <li className="grid grid-cols-3 gap-5 col-span-5">
                      {nfts?.favorites &&
                        nfts?.favorites?.map((nft: Nft) => (
                          <Link key={nft.tokenId} href={`/cask/${nft.tokenId}`}>
                            <BarrelProfile key={nft.tokenId} item={nft} />
                          </Link>
                        ))}
                    </li>
                    <li className="relative col-span-1" />
                  </ul>
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
                    <Button
                      onClick={() =>
                        nfts.addNFTToMetaMask(nfts.activeNft.tokenId)
                      }
                    >
                      Add to metamask
                    </Button>
                    <Spacer size="md" />
                    <div className="block w-full aspect-w-10 aspect-h-7 rounded-lg overflow-hidden">
                      <Image
                        width={350}
                        height={50}
                        src={ipfsImageParser(nfts.activeNft.meta.image)}
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
                        onClick={() => nfts.approveSell(nfts.activeNft.tokenId)}
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
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </BaseLayout>
    </>
  )
}

export default Profile
