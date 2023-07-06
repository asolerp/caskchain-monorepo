import { Trait } from '@_types/nft'
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
  const currentPage = barrels?.paging?.currentPage || 0
  const totalCount = barrels?.paging?.totalCount || 0

  const startIndex = currentPage > 0 ? (currentPage - 1) * pageSize : 0
  const endIndex =
    totalCount > 0
      ? startIndex + pageSize > totalCount
        ? totalCount
        : startIndex + pageSize
      : 0

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
            barrels?.documents?.map((barrel: any, i: number) => (
              <tr
                onClick={() => onClickBarrel(barrel._id.toString())}
                className={`group ${
                  i % 2 === 0 ? 'bg-gray-600' : 'bg-transparent'
                } border-b rounded-lg dark:bg-gray-800 dark:border-gray-700 text-red-600 hover:bg-cask-chain dark:hover:bg-cask-chain`}
              >
                <td className={`px-6 py-4 ${getClassByIndex(i)}`}>
                  <Image
                    className={`object-contain rounded-3xl border-4 border-white`}
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
                  {barrel._id}
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
            {barrels?.paging?.totalCount || 0}
          </span>
        </span>
        {barrels.documents && (
          <PaginationBar
            totalPages={barrels?.paging?.totalPages}
            currentPage={currentPage}
            onClickPage={(page: string) => onClickPage(page)}
          />
        )}
      </nav>
    </div>
  )
}

export default NftList
