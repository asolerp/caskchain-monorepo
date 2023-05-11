import { Nft, Trait } from '@_types/nft'
import { ethers } from 'ethers'
import PaginationBar from './PaginationBar'
import { addressSimplifier, ipfsImageParser } from 'caskchain-lib'
import Image from 'next/image'

const NftList = ({
  barrels,
  pageSize,
  onClickPage,
  onClickBarrel,
}: {
  barrels: any
  pageSize: number
  onClickPage: (page: string) => void
  onClickBarrel: (barrelId: string) => void
}) => {
  const startIndex = (barrels.currentPage - 1) * pageSize
  const endIndex =
    startIndex + pageSize > barrels.totalItems
      ? barrels.totalItems
      : startIndex + pageSize

  const getAttribute = (barrel: Nft, traitType: Trait) => {
    return barrel.meta.attributes.find((attr) => attr.trait_type === traitType)
  }

  const getClassByIndex = (i: number) =>
    i % 2 === 0 ? 'text-white group-hover:text-gray-900' : 'text-gray-600'

  return (
    <div className="relative overflow-x-auto w-full">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-transparent dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              <p className="font-poppins font-semibold text-lg">NFT</p>
            </th>
            <th scope="col" className="px-6 py-3">
              <p className="font-poppins font-semibold text-lg">Barrel ID</p>
            </th>
            <th scope="col" className="px-6 py-3">
              <p className="font-poppins font-semibold text-lg">Owner</p>
            </th>
            <th scope="col" className="px-6 py-3">
              <p className="font-poppins font-semibold text-lg">Liquor</p>
            </th>
            <th scope="col" className="px-6 py-3">
              <p className="font-poppins font-semibold text-lg">Name</p>
            </th>
            <th scope="col" className="px-6 py-3">
              <p className="font-poppins font-semibold text-lg">Year</p>
            </th>
            <th scope="col" className="px-6 py-3">
              <p className="font-poppins font-semibold text-lg">Price</p>
            </th>
          </tr>
        </thead>
        <tbody>
          {barrels &&
            barrels?.items?.map((barrel: Nft, i: number) => (
              <tr
                onClick={() => onClickBarrel(barrel.tokenId.toString())}
                className={`group ${
                  i % 2 === 0 ? 'bg-gray-600' : 'bg-transparent'
                } border-b rounded-lg dark:bg-gray-800 dark:border-gray-700 text-red-600 hover:bg-cask-chain dark:hover:bg-cask-chain`}
              >
                <td className={`px-6 py-4 ${getClassByIndex(i)}`}>
                  <Image
                    className={`object-contain rounded-3xl border-4 border-white`}
                    src={ipfsImageParser(barrel.meta.image)}
                    alt="New NFT"
                    width={100}
                    height={100}
                  />
                </td>
                <th
                  scope="row"
                  className={`px-6 py-4 font-medium ${getClassByIndex(
                    i
                  )} whitespace-nowrap`}
                >
                  {barrel.tokenId}
                </th>
                <td className={`px-6 py-4 ${getClassByIndex(i)}`}>
                  {barrel.owner.nickname
                    ? `@${barrel.owner.nickname}`
                    : addressSimplifier(barrel.owner.address)}
                </td>
                <td className={`px-6 py-4 ${getClassByIndex(i)}`}>
                  {getAttribute(barrel, 'liquor')
                    ? getAttribute(barrel, 'liquor')?.value
                    : ''}
                </td>
                <td className={`px-6 py-4 ${getClassByIndex(i)}`}>
                  {barrel.meta.name}
                </td>
                <td className={`px-6 py-4 ${getClassByIndex(i)}`}>
                  {' '}
                  {getAttribute(barrel, 'liquor')
                    ? getAttribute(barrel, 'age')?.value
                    : ''}
                </td>
                <td className={`px-6 py-4 ${getClassByIndex(i)}`}>
                  {barrel.price &&
                    ethers.utils.formatEther(barrel.price?.toString())}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <nav
        className="flex items-center justify-between pt-4"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {parseInt(startIndex.toString(), 10) + 1 || 0}-
            {parseInt(endIndex.toString(), 10) || 0}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {barrels?.totalItems || 0}
          </span>
        </span>
        {barrels.items && (
          <PaginationBar
            totalPages={barrels.totalPages}
            currentPage={barrels.currentPage}
            onClickPage={(page: string) => onClickPage(page)}
          />
        )}
      </nav>
    </div>
  )
}

export default NftList
