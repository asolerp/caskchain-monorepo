import { useCaskNft } from '@hooks/web3'
import { BaseLayout } from '@ui'
import PieResponsive from '@ui/charts/PieResponsive'
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
    <BaseLayout>
      <div className="max-w-7xl mx-auto pt-40 pb-8 rounded-lg">
        {cask?.data?.tokenId || cask?.isLoading ? (
          <div>
            <div className="grid grid-cols-2 gap-10 mx-auto mb-20 rounded-lg">
              <div className="flex flex-1 justify-center">
                <Image
                  className={` mb-6 object-contain  `}
                  src={'/images/suau_1.png'}
                  alt="New NFT"
                  width={500}
                  height={300}
                />
              </div>
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
                          cask?.buyNft(cask?.data?.tokenId, cask?.data?.price)
                        }
                      />
                    ) : (
                      <MakeOffer
                        cask={cask?.data}
                        onOffer={(offer) => cask?.makeOffer(offer)}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
            {cask.isLoading || cask.isValidating ? (
              <div className="absolute inset-0 h-screen flex justify-center items-center">
                <div
                  role="status"
                  className="flex h-32 w-32  rounded-lg flex-col justify-center items-center"
                >
                  <svg
                    aria-hidden="true"
                    className="w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-white-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 px-4">
                <div className="flex items-center p-2 bg-emerald-400 mb-4 rounded-lg">
                  <h1 className="text-7xl font-semibold text-slate-100">
                    NFT DETAILS
                  </h1>
                </div>
                <h2 className="text-xl text-gray-100">
                  {cask?.data?.meta?.description}
                </h2>
                <div className="grid grid-cols-2 gap-0 mt-14">
                  <div className="flex flex-col justify-center">
                    <h2 className="text-white text-5xl font-semibold">
                      CASK STATS
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
                          <dd className="order-1 text-3xl font-extrabold text-emerald-300">
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
        ) : (
          <div className="flex flex-row justify-center">
            <h1 className="text-7xl font-semibold text-amber-300 mt-40">
              This NFT does not exist
            </h1>
          </div>
        )}
      </div>
    </BaseLayout>
  )
}

export default CaskDetail

export const getServerSideProps: any = async (context: NextPageContext) => {
  const { query } = context
  return { props: { query } }
}
