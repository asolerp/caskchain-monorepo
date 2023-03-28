import React from 'react'

import { FractionBalance } from '@_types/nft'
import { addressSimplifier } from 'utils/addressSimplifier'
import { ethers } from 'ethers'

type Props = {
  balances?: FractionBalance[]
  onRedeem: (address: string, ammount: number) => void
}

const FractionBalances: React.FC<Props> = ({ balances, onRedeem }) => {
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
                    SYMBOL
                  </th>
                  <th
                    scope="col"
                    className="text-lg font-medium text-amber-300 px-6 py-4 text-left"
                  >
                    ADDRESS
                  </th>
                  <th
                    scope="col"
                    className="text-lg font-medium text-amber-300 px-6 py-4 text-left"
                  >
                    BALANCE
                  </th>
                  <th
                    scope="col"
                    className="text-lg font-medium text-amber-300 px-6 py-4 text-left"
                  >
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                <>
                  {balances &&
                    balances?.map((item, i) => {
                      return (
                        <tr key={i} className="">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                            {item.symbol}
                          </td>
                          <td className="text-sm text-gray-100 font-light px-6 py-4 whitespace-nowrap">
                            {addressSimplifier(item.address)}
                          </td>
                          <td className="text-sm text-gray-100 font-light px-6 py-4 whitespace-nowrap">
                            {Number(
                              ethers.utils.formatEther(item.balance)
                            ).toFixed(2)}{' '}
                            FRACTIONS
                          </td>
                          <td className="text-sm text-gray-100 font-light px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() =>
                                onRedeem(item.address, item.balance)
                              }
                              disabled={!item.canRedem}
                              className="bg-amber-300 text-gray-900 px-4 py-2 rounded-md text-sm font-medium disabled:bg-gray-300 disabled:opacity-50"
                            >
                              Redem
                            </button>
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

export default FractionBalances
