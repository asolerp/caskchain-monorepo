import React, { useCallback } from 'react'
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

let CaskIllustration = ({ src }: { src: string }) => {
  return (
    <div className="flex flex-1 justify-end">
      <Image
        className={` mb-6 object-contain  rounded-3xl`}
        src={src}
        alt="New NFT"
        width={500}
        height={300}
      />
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

  const handleCancelOffer = useCallback(() => {
    cask?.cancelOffer()
  }, [cask])

  return (
    <>
      <BaseLayout background="bg-gradient-to-r from-[#0F0F0F] via-[#161616] to-[#000000]">
        <div className="lg:w-3/4 mx-auto pt-40 pb-8 rounded-lg">
          {cask?.data?.tokenId ? (
            <div>
              <div className="grid grid-cols-2 gap-10 mx-auto mb-20 rounded-lg">
                <CaskIllustration src={'/images/nft.png'} />

                <div className="flex flex-col">
                  <div className="flex flex-row space-x-2">
                    <div
                      onClick={() => cask.handleAddFavorite()}
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
                    <div
                      onClick={() => cask.handleShareCask()}
                      className={`cursor-pointer border border-gray-600  w-fit p-2 rounded-md flex flex-row space-x-2 justify-center items-center`}
                    >
                      <ShareIcon
                        width={20}
                        height={20}
                        className="text-gray-600"
                      />
                    </div>
                  </div>
                  <Spacer size="xs" />
                  <div className="flex flex-1 justify-start">
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
                <div className="grid grid-cols-2 gap-0 mt-14">
                  <div className="flex flex-col justify-center">
                    <h2 className="text-white text-5xl font-semibold">
                      Cask Stats
                    </h2>
                    <div className="grid grid-cols-2 mt-6">
                      {cask?.data?.meta?.attributes?.map((attribute: any) => (
                        <div
                          key={attribute.trait_type}
                          className="flex flex-col my-2"
                        >
                          <dt className="order-2 text-xl font-medium text-gray-400">
                            {attribute.trait_type.toUpperCase()}
                          </dt>
                          <dd className="order-1 text-3xl font-extrabold text-cask-chain">
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
                {cask?.data?.transactions?.length > 0 && (
                  <div className="mt-14">
                    <h2 className="text-white text-5xl font-semibold mb-4">
                      TRANSACTIONS HISTORY
                    </h2>
                    <TransactionsHistory
                      transactions={cask?.data?.transactions}
                    />
                  </div>
                )}
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
