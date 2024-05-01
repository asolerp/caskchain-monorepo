import { Trait } from '@_types/nft'
import { ethers } from 'ethers'

import { addressSimplifier, ipfsImageParser } from 'caskchain-lib'
import Image from 'next/image'

const NftList = ({
  barrels,
  onClickBarrel,
}: {
  barrels: any
  pageSize: number
  onClickPage: (page: string) => void
  onClickBarrel: (barrelId: string) => void
}) => {
  const getAttribute = (barrel: any, traitType: Trait) => {
    const attr = barrel.attributes?.[traitType]
    return attr
  }

  const getClassByIndex = (i: number) =>
    i % 2 === 0 ? 'text-white group-hover:text-gray-900' : 'text-gray-600'

  return (
    <div className="relative overflow-x-auto w-full">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-transparent dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              <p className="font-poppins font-semibold text-md">NFT</p>
            </th>
            <th scope="col" className="px-6 py-3">
              <p className="font-poppins font-semibold text-md">CASK ID</p>
            </th>
            <th scope="col" className="px-6 py-3">
              <p className="font-poppins font-semibold text-md">Owner</p>
            </th>
            <th scope="col" className="px-6 py-3">
              <p className="font-poppins font-semibold text-md">Liquor</p>
            </th>
            <th scope="col" className="px-6 py-3">
              <p className="font-poppins font-semibold text-md">Name</p>
            </th>
            <th scope="col" className="px-6 py-3">
              <p className="font-poppins font-semibold text-md">Year</p>
            </th>
            <th scope="col" className="px-6 py-3">
              <p className="font-poppins font-semibold text-md">Price</p>
            </th>
          </tr>
        </thead>
        <tbody>
          {barrels &&
            barrels?.pages?.flatMap((page: any) =>
              page?.result?.map((barrel: any, i: number) => (
                <tr
                  onClick={() => onClickBarrel(barrel.id.toString())}
                  className={`group ${
                    i % 2 === 0 ? 'bg-gray-600' : 'bg-transparent'
                  } border-b rounded-lg dark:bg-gray-800 dark:border-gray-700 text-red-600 hover:bg-cask-chain dark:hover:bg-cask-chain`}
                >
                  <td className={`px-6 py-4 ${getClassByIndex(i)}`}>
                    <Image
                      className={`object-contain rounded-xl border-2 border-white`}
                      src={ipfsImageParser(barrel.image)}
                      alt="New NFT"
                      width={100}
                      height={100}
                      priority={true}
                      quality={100}
                    />
                  </td>
                  <th
                    scope="row"
                    className={`px-6 py-4 font-medium ${getClassByIndex(
                      i
                    )} whitespace-nowrap`}
                  >
                    {barrel.id}
                  </th>
                  <td className={`px-6 py-4 ${getClassByIndex(i)}`}>
                    {barrel.owner.nickname
                      ? `@${barrel.owner.nickname}`
                      : addressSimplifier(barrel.owner.address)}
                  </td>
                  <td className={`px-6 py-4 ${getClassByIndex(i)}`}>
                    {getAttribute(barrel, 'liquor')}
                  </td>
                  <td className={`px-6 py-4 ${getClassByIndex(i)}`}>
                    {barrel.name}
                  </td>
                  <td className={`px-6 py-4 ${getClassByIndex(i)}`}>
                    {getAttribute(barrel, 'age')}
                  </td>
                  <td className={`px-6 py-4 ${getClassByIndex(i)}`}>
                    {barrel.price &&
                      ethers.utils.formatEther(barrel.price?.toString())}
                  </td>
                </tr>
              ))
            )}
        </tbody>
      </table>
    </div>
  )
}

export default NftList
