import React from 'react'

import { TransactionHistory } from '@_types/nft'
import { ethers } from 'ethers'
import { addressSimplifier } from 'utils/addressSimplifier'
import Link from 'next/link'
import {
  ArrowTopRightOnSquareIcon,
  ShareIcon,
} from '@heroicons/react/24/outline'

type TransactionsHistoryProps = {
  transactions?: TransactionHistory[]
}

const TransactionsHistory: React.FC<TransactionsHistoryProps> = ({
  transactions,
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
                    Barrel ID
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
                    To
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
                    Price
                  </th>
                  <th
                    scope="col"
                    className="text-lg font-medium text-cask-chain px-6 py-4 text-left"
                  >
                    TX
                  </th>
                </tr>
              </thead>
              <tbody>
                <>
                  {transactions &&
                    transactions?.map((item, i) => {
                      console.log('ITEM', item._id)
                      return (
                        <tr key={i} className="">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                            {i}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                            <p className="text-center">#{item?.tokenId}</p>
                          </td>
                          <td className="text-sm text-gray-100 font-light px-6 py-4 whitespace-nowrap">
                            {addressSimplifier(item.from)}
                          </td>
                          <td className="text-sm text-gray-100 font-light px-6 py-4 whitespace-nowrap">
                            {addressSimplifier(item.to)}
                          </td>
                          <td className="text-sm text-gray-100 font-light px-6 py-4 whitespace-nowrap">
                            {item.date.toString()}
                          </td>
                          <td className="text-sm text-gray-100 font-light px-6 py-4 whitespace-nowrap">
                            {item?.value &&
                              ethers.utils
                                .formatEther(item?.value)
                                .toString()}{' '}
                            ETH
                          </td>
                          <td className="text-sm text-gray-100 font-light px-6 py-4 whitespace-nowrap">
                            <Link
                              href={`https://mumbai.polygonscan.com/tx/${item?._id}`}
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

export default React.memo(TransactionsHistory)
