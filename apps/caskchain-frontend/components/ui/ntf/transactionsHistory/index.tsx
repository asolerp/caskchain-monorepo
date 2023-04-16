import React from 'react'
import { format } from 'date-fns'

import { TransactionHistory } from '@_types/nft'
import { ethers } from 'ethers'
import { addressSimplifier } from 'utils/addressSimplifier'
import Link from 'next/link'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

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
                    Buyer
                  </th>
                  <th
                    scope="col"
                    className="text-lg font-medium text-cask-chain px-6 py-4 text-center"
                  >
                    Sale Price
                  </th>
                  <th
                    scope="col"
                    className="text-lg font-medium text-cask-chain px-6 py-4 text-center"
                  >
                    Barrel ID
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
                    TX
                  </th>
                </tr>
              </thead>
              <tbody>
                <>
                  {transactions &&
                    transactions?.map((item, i) => {
                      return (
                        <tr key={i} className="">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                            {item?.to}
                          </td>
                          <td
                            align="center"
                            className="text-sm text-gray-100 font-light px-6 py-4 whitespace-nowrap"
                          >
                            {item?.purchasePrice &&
                              ethers.utils
                                .formatEther(item?.purchasePrice)
                                .toString()}{' '}
                            ETH
                          </td>
                          <td
                            align="center"
                            className="text-sm text-gray-100 font-light px-6 py-4 whitespace-nowrap"
                          >
                            {item.tokenId}
                          </td>
                          <td className="text-sm text-gray-100 font-light px-6 py-4 whitespace-nowrap">
                            <p>{format(new Date(item?.timestamp), 'PP p')}</p>
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

export default React.memo(TransactionsHistory)
