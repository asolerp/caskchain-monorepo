import React from 'react'

import { FractionHolders } from '@_types/nft'
import { addressSimplifier } from 'utils/addressSimplifier'

type Props = {
  holders?: FractionHolders[]
}

const FractionHolders: React.FC<Props> = ({ holders }) => {
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
                    className="text-lg font-medium text-emerald-300 px-6 py-4 text-left"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="text-lg font-medium text-emerald-300 px-6 py-4 text-left"
                  >
                    ADDRESS
                  </th>
                  <th
                    scope="col"
                    className="text-lg font-medium text-emerald-300 px-6 py-4 text-left"
                  >
                    BALANCE
                  </th>
                </tr>
              </thead>
              <tbody>
                <>
                  {holders &&
                    holders?.map((item, i) => {
                      return (
                        <tr key={i} className="">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                            {i}
                          </td>
                          <td className="text-sm text-gray-100 font-light px-6 py-4 whitespace-nowrap">
                            {addressSimplifier(item.address)}
                          </td>
                          <td className="text-sm text-gray-100 font-light px-6 py-4 whitespace-nowrap">
                            {item.balance.toFixed(2)}
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

export default FractionHolders
