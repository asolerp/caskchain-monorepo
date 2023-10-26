import React from 'react'

import { LatestOffers } from '@_types/nft'
import { format } from 'date-fns'
import { ethers } from 'ethers'
import Link from 'next/link'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { Spacer } from 'caskchain-ui'

type NFTLatestOffersProps = {
  nftLatestOffers?: LatestOffers[]
}

const NFTLatestOffers: React.FC<NFTLatestOffersProps> = ({
  nftLatestOffers,
}) => {
  return (
    <div className="flex flex-col border-b border-b-gray-400 ">
      <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
        <div className="inline-block min-w-full">
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="border-b bg-[#282828]">
                <tr>
                  <th
                    scope="col"
                    className="text-lg font-poppins font-light text-gray-300 py-2 px-6 text-left"
                  >
                    Offer
                  </th>
                  <th
                    scope="col"
                    className="text-lg font-poppins font-light text-gray-300 py-2 px-6 text-left"
                  >
                    From
                  </th>
                  <th
                    scope="col"
                    className="text-lg font-poppins font-light text-gray-300 py-2 px-6 text-left"
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                <>
                  {nftLatestOffers &&
                    nftLatestOffers?.map((item, i) => {
                      return (
                        <tr key={i}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                            {ethers.utils.formatEther(item.bid)} ETH
                          </td>
                          <td
                            align="left"
                            className="text-sm text-gray-100 font-light px-6 py-4 whitespace-nowrap"
                          >
                            @{item?.bidder?.nickname}
                          </td>
                          <td className="text-sm text-gray-100 font-light px-6 py-4 whitespace-nowrap">
                            {format(new Date(item.createdAt), 'PP p')}
                          </td>
                          <td className="text-sm text-gray-100 font-light px-6 py-4 whitespace-nowrap">
                            <Link
                              href={`https://mumbai.polygonscan.com/tx/${item?.txHash}`}
                            >
                              <ArrowTopRightOnSquareIcon className="h-6 w-6 text-cask-chain" />
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                </>
              </tbody>
            </table>
            {(!nftLatestOffers || nftLatestOffers.length === 0) && (
              <div className="flex flex-col h-60 w-full justify-center items-center">
                <Image
                  src="/icons/barrels.svg"
                  width={100}
                  height={100}
                  alt="empty favourites"
                />
                <Spacer size="md" />
                <h3 className="font-poppins text-2xl text-gray-500 font-thin tracking-wider">
                  {`No offers`}
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NFTLatestOffers
