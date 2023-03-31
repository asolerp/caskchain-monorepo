import { useCaskNft } from '@hooks/web3'
import { BaseLayout } from '@ui'
import PieResponsive from '@ui/charts/PieResponsive'
import { LoadingAnimation } from '@ui/common/Loading/LoadingAnimation'
import FractionalizedBuyout from '@ui/ntf/buyout/FractionalizedBuyout'
import MakeOffer from '@ui/ntf/buyout/MakeOffer'
import OnSale from '@ui/ntf/buyout/OnSale'
import FractionHolders from '@ui/ntf/fractionHolders'
import TransactionsHistory from '@ui/ntf/transactionsHistory'
import { ethers } from 'ethers'

import { NextPageContext } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'

// import React from 'react'
function CaskDetail() {
  const route = useRouter()
  const { cask } = useCaskNft({ caskId: route.query.caskId as string })

  return (
    <>
      {(cask?.isLoading || cask?.isValidating) && <LoadingAnimation />}
      <BaseLayout background="bg-gradient-to-r from-[#0F0F0F] via-[#161616] to-[#000000]">
        <div className="lg:w-3/4 mx-auto pt-40 pb-8 rounded-lg">
          {cask?.data?.tokenId && (
            <div>
              <div className="grid grid-cols-2 gap-10 mx-auto mb-20 rounded-lg">
                <div className="flex flex-1 justify-center">
                  <Image
                    className={` mb-6 object-contain  `}
                    src={'/images/nft.png'}
                    alt="New NFT"
                    width={500}
                    height={300}
                  />
                </div>
                {!cask?.isLoading && !cask?.isValidating && (
                  <div className="flex flex-1 justify-center">
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
                            onCancelOffer={() => cask?.cancelOffer()}
                            onOffer={(offer) => cask?.makeOffer(offer)}
                          />
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
              {cask.isLoading || cask.isValidating ? (
                <></>
              ) : (
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
              )}
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
