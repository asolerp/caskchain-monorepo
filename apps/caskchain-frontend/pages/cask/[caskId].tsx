import React, { useContext, useEffect } from 'react'

import { BaseLayout } from '@ui'
import PieResponsive from '@ui/charts/PieResponsive'
import Spacer from '@ui/common/Spacer'

import FractionHolders from '@ui/ntf/fractionHolders'

import { ethers } from 'ethers'

import { NextPageContext } from 'next'

import { useRouter } from 'next/router'

import SuccessPurchaseModal from '@ui/modals/SuccessPurchase'
import Header from '@ui/layout/Header'

import CaskGallery from './components/CaskGallery'
// import CaskFavorite from './components/CaskFavorite'
import CaskOperations from './components/CaskOperations'
import CaskDetails from './components/CaskDetails'
import CaskStats from './components/CaskStats'
import TransactionsHistory from '@ui/tables/TransactionsHistory'
import { useCaskNft } from '@hooks/web3/useCaskNft'
import { LoadingContext } from 'components/contexts/LoadingContext'

export enum AssetType {
  IMAGE = 'image',
  PINATA = 'pinata',
  VIDEO = 'video',
}

function CaskDetail() {
  const route = useRouter()

  const { isLoading: isLoadingGlobal, setIsLoading: setIsLoadingGlobal } =
    useContext(LoadingContext)

  const {
    data,
    rates,
    buyNft,
    makeOffer,
    isLoading,
    // isFavorite,
    cancelOffer,
    successModal,
    salesHistory,
    buyWithERC20,
    // totalFavorites,
    handleUserState,
    setSuccessModal,
    // handleShareCask,
    // debounceAddFavorite,
  } = useCaskNft({ caskId: route.query.caskId as string })

  useEffect(() => {
    setIsLoadingGlobal(isLoading)
  }, [isLoading, setIsLoadingGlobal])

  const liquor = data?.meta?.attributes?.liquor
  const mapLiquorHeader: any = {
    whiskey: 'Smoky Elixir',
    rum: `Corsair's Island`,
    tequila: 'Aztec Spirit',
    brandy: 'Enigma Symphony',
  }

  return (
    <>
      <SuccessPurchaseModal
        cask={data}
        modalIsOpen={successModal}
        closeModal={() => {
          setSuccessModal(false)
        }}
      />

      <BaseLayout background="bg-black-light">
        <>
          <Header background={liquor}>
            <h1 className="font-rale font-semibold text-6xl text-cask-chain mb-10">
              {mapLiquorHeader[liquor]?.split(' ')[0]}{' '}
              <span className="text-white">
                {mapLiquorHeader[liquor]?.split(' ')[1]}
              </span>
            </h1>
          </Header>
          {isLoadingGlobal ? (
            <div className="flex flex-col justify-center items-center w-full h-screen"></div>
          ) : (
            <>
              {data?.meta ? (
                <div className="lg:w-3/4 mx-auto pt-20 pb-8 rounded-lg">
                  <div>
                    <div className="max-w-7xl mx-auto grid grid-cols-5 gap-10 sm:px-6 px-4 rounded-lg">
                      <CaskGallery isLoading={isLoading} data={data} />
                      <div className="flex flex-col col-span-2">
                        {/* <CaskFavorite
                          onClickFavorite={() => debounceAddFavorite()}
                          onClickShare={() => handleShareCask()}
                          isFavorite={isFavorite}
                          totalFavorites={totalFavorites}
                        /> */}
                        <Spacer size="xs" />
                        <CaskOperations
                          data={data}
                          rates={rates}
                          buyNft={buyNft}
                          makeOffer={makeOffer}
                          cancelOffer={cancelOffer}
                          buyWithERC20={buyWithERC20}
                          handleUserState={handleUserState}
                        />
                      </div>
                    </div>
                    <Spacer size="xl" />
                    <Spacer size="xl" />
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 px-4">
                      <CaskDetails data={data} />
                      <Spacer size="xl" />
                      <Spacer size="xl" />
                      <CaskStats data={data} />
                      <Spacer size="xl" />
                      <Spacer size="xl" />
                      {data?.fractions?.isForSale && (
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
                                          data?.fractions?.holders
                                        ).map(([address, balance]: any) => ({
                                          name: address,
                                          value: Number(
                                            ethers
                                              .formatEther(balance)
                                              .toString()
                                          ),
                                        }))}
                                      />
                                    </div>
                                  </>
                                </div>
                                <div className="w-1/2 flex flex-grow justify-center items-center">
                                  {data?.fractions && (
                                    <div className="w-full">
                                      <h2 className="text-white text-5xl font-semibold mb-4">
                                        HOLDERS
                                      </h2>
                                      <FractionHolders
                                        holders={Object.entries(
                                          data?.fractions?.holders
                                        )
                                          .map(([address, balance]: any) => ({
                                            address: address,
                                            balance: Number(
                                              ethers
                                                .formatEther(balance)
                                                .toString()
                                            ),
                                          }))
                                          .sort(
                                            (a, b) => b.balance - a.balance
                                          )}
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
                      {/* <div>
                        <h2 className="text-5xl font-semibold font-rale text-white border-b border-cask-chain pb-3">
                          Last Offers
                        </h2>
                        <Spacer size="md" />
                        <div>
                          <NFTLatestOffers nftLatestOffers={latestOffers} />
                        </div>
                      </div> */}
                      <Spacer size="xl" />
                      <div>
                        <h2 className="text-white pb-3 text-5xl font-semibold border-b border-cask-chain">
                          Sales History
                        </h2>
                        <Spacer size="md" />
                        <div>
                          <TransactionsHistory transactions={salesHistory} />
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
        </>
      </BaseLayout>
    </>
  )
}

export default CaskDetail

export const getServerSideProps: any = async (context: NextPageContext) => {
  const { query } = context
  return { props: { query } }
}
