import React from 'react'

import { LatestOffers } from '@_types/nft'
import { format } from 'date-fns'
import { ethers } from 'ethers'
import Link from 'next/link'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

type NFTLatestOffersProps = {
  nftLatestOffers?: LatestOffers[]
}

const NFTLatestOffers: React.FC<NFTLatestOffersProps> = ({
  nftLatestOffers,
}) => {
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
        <div className="py-2 inline-block min-w-full">
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th
                    scope="col"
                    className="text-lg font-medium text-cask-chain px-6 py-4 text-left"
                  >
                    Offer
                  </th>
                  <th
                    scope="col"
                    className="text-lg font-medium text-cask-chain px-6 py-4 text-left"
                  >
                    From
                  </th>
                  <th
                    scope="col"
                    className="text-lg font-medium text-cask-chain px-6 py-4 text-left"
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
                            {ethers.utils.formatEther(item.offer)} ETH
                          </td>
                          <td
                            align="left"
                            className="text-sm text-gray-100 font-light px-6 py-4 whitespace-nowrap"
                          >
                            @{item.bidder}
                          </td>
                          <td className="text-sm text-gray-100 font-light px-6 py-4 whitespace-nowrap">
                            {format(item.timestamp, 'PP p')}
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default NFTLatestOffers
