import React, { useCallback, useState } from 'react'
import { ShareIcon } from '@heroicons/react/24/outline'
import BookmarkIcon from 'public/icons/bookmark.svg'

import { useCaskNft } from '@hooks/web3'
import { BaseLayout } from '@ui'
import PieResponsive from '@ui/charts/PieResponsive'
import Spacer from '@ui/common/Spacer'
import FractionalizedBuyout from '@ui/ntf/buyout/FractionalizedBuyout'
import MakeOffer from '@ui/ntf/buyout/MakeOffer'
import OnSale from '@ui/ntf/buyout/OnSale'
import FractionHolders from '@ui/ntf/fractionHolders'
import TransactionsHistory from '@ui/ntf/transactionsHistory'
import { ethers } from 'ethers'

import { NextPageContext } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import NFTLatestOffers from '@ui/tables/NFTLatestOffers'
import { ipfsImageParser } from 'utils/ipfsImageParser'
import SuccessPurchaseModal from '@ui/modals/SuccessPurchase'

let CaskIllustration = ({
  src,
  activeAsset,
}: {
  src: string
  activeAsset: number
}) => {
  return (
    <div className="flex  justify-center col-span-2 rounded-2xl">
      {activeAsset === 1 && (
        <Image
          className={`object-contain rounded-2xl`}
          src={src}
          alt="New NFT"
          width={350}
          height={400}
        />
      )}
      {activeAsset === 2 && (
        <video
          width="500"
          height="300"
          autoPlay={true}
          controls={false}
          src="https://res.cloudinary.com/enalbis/video/upload/v1681586853/CaskChain/flofru3viqsirclxlapx.mp4"
        />
      )}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
CaskIllustration = React.memo(CaskIllustration)

// import React from 'react'
function CaskDetail() {
  const route = useRouter()

  const { cask } = useCaskNft({ caskId: route.query.caskId as string })
  const [activeAsset, setActiveAsset] = useState(1)

  const handleCancelOffer = useCallback(() => {
    cask?.cancelOffer()
  }, [cask])

  const mainImage = !cask?.isValidating
    ? ipfsImageParser(cask?.data?.meta?.image)
    : ''

  return (
    <>
      <SuccessPurchaseModal
        cask={cask?.data}
        modalIsOpen={cask?.successModal}
        closeModal={() => {
          cask?.setSuccessModal(false)
        }}
      />
      <BaseLayout background="bg-gradient-to-r from-[#0F0F0F] via-[#161616] to-[#000000]">
        <div className="lg:w-3/4 mx-auto pt-40 pb-8 rounded-lg">
          {cask?.data?.tokenId && !cask?.isLoading ? (
            <div>
              <div className="max-w-7xl mx-auto grid grid-cols-5 gap-10 mb-20 sm:px-6 lg:px-8 px-4 rounded-lg">
                <div>
                  <div className="flex flex-col justify-end items-end">
                    <div
                      onClick={() => setActiveAsset(1)}
                      className={`${
                        activeAsset === 1 ? 'border-2 border-cask-chain' : ''
                      } p-2 rounded-xl flex items-center justify-center`}
                    >
                      {!cask?.isValidating && (
                        <Image
                          className={`object-contain rounded-3xl`}
                          src={mainImage}
                          alt="New NFT"
                          width={100}
                          height={150}
                          loading="lazy"
                        />
                      )}
                    </div>
                    <Spacer size="xs" />
                    <div
                      onClick={() => setActiveAsset(2)}
                      className={`${
                        activeAsset === 2 ? 'border-2 border-cask-chain' : ''
                      } p-2 rounded-xl flex items-center justify-center`}
                    >
                      <Image
                        className={`object-contain rounded-3xl`}
                        src={'/images/frame.png'}
                        alt="New NFT"
                        width={100}
                        height={150}
                      />
                    </div>
                  </div>
                </div>
                <CaskIllustration src={mainImage} activeAsset={activeAsset} />
                <div className="flex flex-col col-span-2">
                  <div className="flex flex-row space-x-2 w-full">
                    {cask?.isUserNeededDataFilled && (
                      <div
                        onClick={() => cask.debounceAddFavorite()}
                        className={`cursor-pointer border ${
                          cask.isFavorite
                            ? 'border-cask-chain'
                            : 'border-gray-600'
                        }  w-fit p-2 rounded-md flex flex-row space-x-2 justify-center items-center`}
                      >
                        <p className="text-white">{cask.totalFavorites}</p>
                        <BookmarkIcon
                          color={cask.isFavorite ? '#CAFC01' : '#fff'}
                          fill={cask.isFavorite ? '#CAFC01' : 'transparent'}
                          className="cursor-pointer"
                          width={20}
                          height={20}
                        />
                      </div>
                    )}
                    <div
                      onClick={() => cask.handleShareCask()}
                      className={`cursor-pointer border border-gray-600  w-fit p-2 rounded-md flex flex-row space-x-2 justify-center items-center`}
                    >
                      <ShareIcon
                        width={20}
                        height={20}
                        className="text-white"
                      />
                    </div>
                  </div>
                  <Spacer size="xs" />
                  <div className="flex w-full justify-start">
                    {cask?.data?.fractions?.isForSale ? (
                      <FractionalizedBuyout
                        cask={cask?.data}
                        onFullBuy={cask?.buyFractionizedNft}
                        onBuyFraction={(fractions: number) =>
                          cask?.buyFractions(
                            cask?.data?.fractions?.tokenAddress,
                            cask?.data?.fractions?.unitPrice,
                            fractions
                          )
                        }
                      />
                    ) : (
                      <>
                        {cask?.data?.price > 0 ? (
                          <OnSale
                            cask={cask?.data}
                            onBuyWithERC20={() =>
                              cask?.buyWithERC20(
                                cask?.data?.tokenId,
                                cask?.data?.erc20Prices?.USDT
                              )
                            }
                            onBuy={() =>
                              cask?.buyNft(
                                cask?.data?.tokenId,
                                cask?.data?.price
                              )
                            }
                          />
                        ) : (
                          <MakeOffer
                            cask={cask?.data}
                            onCancelOffer={handleCancelOffer}
                            onOffer={(offer) => cask?.makeOffer(offer)}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 px-4">
                <div className="flex items-center p-2 bg-cask-chain mb-4 rounded-lg">
                  <h1 className="text-7xl font-semibold font-rale text-black">
                    Nft Details
                  </h1>
                </div>
                <h2 className="text-xl text-gray-100">
                  {cask?.data?.meta?.description}
                </h2>
                <div className="grid grid-cols-1 gap-0 mt-14">
                  <div className="flex flex-col justify-center">
                    <h2 className="text-white text-5xl font-semibold">
                      Cask Stats
                    </h2>
                    <div className="grid grid-cols-4 gap-4 mt-6">
                      {cask?.data?.meta?.attributes?.map((attribute: any) => (
                        <div
                          key={attribute.trait_type}
                          className="flex flex-col border border-cask-chain rounded-xl p-4"
                        >
                          <dt className="text-xl font-medium text-gray-400">
                            {attribute.trait_type.toUpperCase()}
                          </dt>
                          <Spacer size="xs" />
                          <dd className=" text-2xl font-extrabold text-cask-chain">
                            {attribute.value}
                          </dd>
                        </div>
                      ))}
                    </div>
                  </div>
                  {cask?.data?.fractions?.isForSale && (
                    <>
                      <div className="flex justify-center">
                        <PieResponsive
                          data={Object.entries(
                            cask?.data?.fractions?.holders
                          ).map(([address, balance]: any) => ({
                            name: address,
                            value: Number(
                              ethers.utils.formatEther(balance).toString()
                            ),
                          }))}
                        />
                      </div>
                    </>
                  )}
                </div>
                {cask?.data?.fractions && (
                  <div className="mt-14">
                    <h2 className="text-white text-5xl font-semibold mb-4">
                      HOLDERS
                    </h2>
                    <FractionHolders
                      holders={Object.entries(cask?.data?.fractions?.holders)
                        .map(([address, balance]: any) => ({
                          address: address,
                          balance: Number(
                            ethers.utils.formatEther(balance).toString()
                          ),
                        }))
                        .sort((a, b) => b.balance - a.balance)}
                    />
                  </div>
                )}
                <Spacer size="3xl" />
                <div>
                  <h2 className="text-white pb-3 text-5xl font-semibold border-b border-cask-chain">
                    LAST OFFERS
                  </h2>
                  <Spacer size="md" />

                  {cask?.latestOffers?.length > 0 ? (
                    <div>
                      <NFTLatestOffers nftLatestOffers={cask?.latestOffers} />
                    </div>
                  ) : (
                    <div className="mt-14">
                      <h2 className="text-white font-poppins text-3xl">
                        No offers
                      </h2>
                    </div>
                  )}
                </div>
                <Spacer size="xl" />
                <div>
                  <h2 className="text-white pb-3 text-5xl font-semibold border-b border-cask-chain">
                    SALES HISTORY
                  </h2>
                  <Spacer size="md" />
                  {cask?.salesHistory?.length > 0 ? (
                    <div>
                      <TransactionsHistory transactions={cask?.salesHistory} />
                    </div>
                  ) : (
                    <div className="mt-14">
                      <h2 className="text-white font-poppins text-3xl">
                        No transactions
                      </h2>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-grow justify-center items-center">
              <h2 className="text-white font-poppins text-3xl">
                This Barrel does not exists
              </h2>
            </div>
          )}
        </div>
      </BaseLayout>
    </>
  )
}

export default CaskDetail

export const getServerSideProps: any = async (context: NextPageContext) => {
  const { query } = context
  return { props: { query } }
}
