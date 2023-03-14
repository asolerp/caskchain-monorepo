import React from 'react'

import { TransactionHistory } from '@_types/nft'
import { ethers } from 'ethers'
import { addressSimplifier } from 'utils/addressSimplifier'

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
                    className="text-lg font-medium text-amber-300 px-6 py-4 text-left"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="text-lg font-medium text-amber-300 px-6 py-4 text-left"
                  >
                    FROM
                  </th>
                  <th
                    scope="col"
                    className="text-lg font-medium text-amber-300 px-6 py-4 text-left"
                  >
                    TO
                  </th>
                  <th
                    scope="col"
                    className="text-lg font-medium text-amber-300 px-6 py-4 text-left"
                  >
                    DATE
                  </th>
                  <th
                    scope="col"
                    className="text-lg font-medium text-amber-300 px-6 py-4 text-left"
                  >
                    PRICE
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
                            {i}
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

export default TransactionsHistory
