import React from 'react'

import { Offers } from '@_types/nft'
import { ethers } from 'ethers'
import { addressSimplifier } from 'utils/addressSimplifier'
import Link from 'next/link'
import Badge from '@ui/common/Badge'
import parseStatusColors from './utils/parseStatusColors'
import Button from '@ui/common/Button'

type OffersReceivedProps = {
  onAccept: (tokenId: string) => void
  offersReceived?: Offers[]
  loading?: boolean
}

const OffersReceived: React.FC<OffersReceivedProps> = ({
  onAccept,
  loading,
  offersReceived,
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
                    #
                  </th>
                  <th
                    scope="col"
                    className="text-lg font-medium text-cask-chain px-6 py-4 text-left"
                  >
                    Nft Id
                  </th>
                  <th
                    scope="col"
                    className="text-lg font-medium text-cask-chain px-6 py-4 text-left"
                  >
                    Bidder
                  </th>
                  <th
                    scope="col"
                    className="text-lg font-medium text-cask-chain px-6 py-4 text-left"
                  >
                    Owner
                  </th>
                  <th
                    scope="col"
                    className="text-lg font-medium text-cask-chain px-6 py-4 text-left"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="text-lg font-medium text-cask-chain px-6 py-4 text-left"
                  >
                    Offer
                  </th>
                  <th
                    scope="col"
                    className="text-lg font-medium text-cask-chain px-6 py-4 text-center"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="text-lg font-medium text-cask-chain px-6 py-4 text-center"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <>
                  {offersReceived &&
                    offersReceived?.map((item, i) => {
                      return (
                        <tr
                          key={i}
                          className={
                            item.status === 'live'
                              ? 'border border-cask-chain'
                              : ''
                          }
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                            {i}
                          </td>
                          <td
                            align="center"
                            className="text-sm text-gray-100 font-light px-6 py-4 whitespace-nowrap"
                          >
                            <Link
                              href={`/cask/${item.tokenId}`}
                              className="bg-cask-chain px-5 font-poppins font-semibold text-black py-1 rounded-md"
                            >
                              {item.tokenId}
                            </Link>
                          </td>
                          <td className="text-sm text-gray-100 font-light px-6 py-4 whitespace-nowrap">
                            {addressSimplifier(item.bidder)}
                          </td>
                          <td className="text-sm text-gray-100 font-light px-6 py-4 whitespace-nowrap">
                            {addressSimplifier(item.owner)}
                          </td>
                          <td className="text-sm text-gray-100 font-light px-6 py-4 whitespace-nowrap">
                            <p>{item.createdAt}</p>
                          </td>
                          <td className="text-sm text-gray-100 font-light px-6 py-4 whitespace-nowrap">
                            {item?.bid &&
                              ethers.utils
                                .formatEther(item?.bid)
                                .toString()}{' '}
                            Matic
                          </td>
                          <td className="text-sm text-gray-100 font-light px-6 py-4 whitespace-nowrap">
                            <Badge
                              bgColor={parseStatusColors(item.status).bg}
                              textColor={parseStatusColors(item.status).text}
                            >
                              {item.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="text-sm text-gray-100 font-light px-6 py-4 whitespace-nowrap">
                            {item.status === 'live' ? (
                              <Button
                                loading={loading}
                                labelStyle="text-black"
                                onClick={() => onAccept(item.tokenId)}
                              >
                                Accept offer
                              </Button>
                            ) : (
                              <p className="font-poppins text-center">
                                No actions
                              </p>
                            )}
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

export default OffersReceived
