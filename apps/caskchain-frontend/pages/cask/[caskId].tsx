import React from 'react'

import { useCaskNft } from '@hooks/web3'
import { BaseLayout } from '@ui'
import PieResponsive from '@ui/charts/PieResponsive'
import Spacer from '@ui/common/Spacer'

import FractionHolders from '@ui/ntf/fractionHolders'

import { ethers } from 'ethers'

import { NextPageContext } from 'next'

import { useRouter } from 'next/router'
import NFTLatestOffers from '@ui/tables/NFTLatestOffers'

import SuccessPurchaseModal from '@ui/modals/SuccessPurchase'
import useLocalLoading from '@hooks/common/useLocalLoading'
import Header from '@ui/layout/Header'

import CaskGallery from './components/CaskGallery'
import CaskFavorite from './components/CaskFavorite'
import CaskOperations from './components/CaskOperations'
import CaskDetails from './components/CaskDetails'
import CaskStats from './components/CaskStats'
import TransactionsHistory from '@ui/tables/TransactionsHistory'

export enum AssetType {
  IMAGE = 'image',
  PINATA = 'pinata',
  VIDEO = 'video',
}

function CaskDetail() {
  const route = useRouter()
  const { loading } = useLocalLoading()
  const { cask } = useCaskNft({ caskId: route.query.caskId as string })

  const liquor = cask?.data?.meta?.attributes[0].value

  const mapLiquorHeader: any = {
    whiskey: 'Smoky Elixir',
    rum: `Corsair's Island`,
    tequila: 'Aztec Spirit',
    brandy: 'Enigma Symphony',
  }

  return (
    <>
      <SuccessPurchaseModal
        cask={cask?.data}
        modalIsOpen={cask?.successModal}
        closeModal={() => {
          cask?.setSuccessModal(false)
        }}
      />

      <BaseLayout background="bg-black-light">
        {loading ? (
          <div className="w-screen h-screen"></div>
        ) : (
          <>
            <Header background={liquor}>
              <h1 className="font-rale font-semibold text-6xl text-cask-chain mb-10">
                {mapLiquorHeader[liquor]?.split(' ')[0]}{' '}
                <span className="text-white">
                  {mapLiquorHeader[liquor]?.split(' ')[1]}
                </span>
              </h1>
            </Header>
            {cask?.data?.meta ? (
              <div className="lg:w-3/4 mx-auto pt-20 pb-8 rounded-lg">
                <div>
                  <div className="max-w-7xl mx-auto grid grid-cols-5 gap-10 sm:px-6 px-4 rounded-lg">
                    <CaskGallery cask={cask} />
                    <div className="flex flex-col col-span-2">
                      <CaskFavorite cask={cask} />
                      <Spacer size="xs" />
                      <CaskOperations cask={cask} />
                    </div>
                  </div>
                  <Spacer size="xl" />
                  <Spacer size="xl" />
                  <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 px-4">
                    <CaskDetails cask={cask} />
                    <Spacer size="xl" />
                    <Spacer size="xl" />
                    <CaskStats cask={cask} />
                    <Spacer size="xl" />
                    <Spacer size="xl" />
                    {cask?.data?.fractions?.isForSale && (
                      <>
                        <section>
                          <div>
                            <div className="flex items-center p-2 bg-cask-chain mb-4 rounded-lg">
                              <h1 className="text-7xl font-semibold font-rale text-black">
                                Fractions
                              </h1>
                            </div>
                            <div className="flex flex-row">
                              <div className="w-1/2 h-full">
                                <>
                                  <div className="flex justify-center">
                                    <PieResponsive
                                      data={Object.entries(
                                        cask?.data?.fractions?.holders
                                      ).map(([address, balance]: any) => ({
                                        name: address,
                                        value: Number(
                                          ethers.formatEther(balance).toString()
                                        ),
                                      }))}
                                    />
                                  </div>
                                </>
                              </div>
                              <div className="w-1/2 flex flex-grow justify-center items-center">
                                {cask?.data?.fractions && (
                                  <div className="w-full">
                                    <h2 className="text-white text-5xl font-semibold mb-4">
                                      HOLDERS
                                    </h2>
                                    <FractionHolders
                                      holders={Object.entries(
                                        cask?.data?.fractions?.holders
                                      )
                                        .map(([address, balance]: any) => ({
                                          address: address,
                                          balance: Number(
                                            ethers
                                              .formatEther(balance)
                                              .toString()
                                          ),
                                        }))
                                        .sort((a, b) => b.balance - a.balance)}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </section>
                        <Spacer size="xl" />
                        <Spacer size="xl" />
                      </>
                    )}
                    <div>
                      <h2 className="text-5xl font-semibold font-rale text-white border-b border-cask-chain pb-3">
                        Last Offers
                      </h2>
                      <Spacer size="md" />
                      <div>
                        <NFTLatestOffers nftLatestOffers={cask?.latestOffers} />
                      </div>
                    </div>
                    <Spacer size="xl" />
                    <div>
                      <h2 className="text-white pb-3 text-5xl font-semibold border-b border-cask-chain">
                        Sales History
                      </h2>
                      <Spacer size="md" />
                      <div>
                        <TransactionsHistory
                          transactions={cask?.salesHistory}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-screen justify-center items-center">
                <h2 className="text-white font-poppins text-3xl">
                  This Barrel does not exists
                </h2>
              </div>
            )}
          </>
        )}
      </BaseLayout>
    </>
  )
}

export default CaskDetail

export const getServerSideProps: any = async (context: NextPageContext) => {
  const { query } = context
  return { props: { query } }
}
