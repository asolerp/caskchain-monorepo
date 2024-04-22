import useGetBalance from '@hooks/common/useGetBalance'
// import { useNftTransactions } from '@hooks/web3'
import Card from '@ui/common/Card'

import ClientOnly from 'components/pages/ClientOnly'
// import { format } from 'date-fns'
// import { ethers } from 'ethers'

const RightSidebar = () => {
  // const { transactions } = useNftTransactions()
  const { balance } = useGetBalance()

  return (
    <div className="flex w-[600px] border-l-2 border-gray-300  px-10 py-10 bg-gray-200">
      <ClientOnly>
        <div className="w-full">
          <h1 className="font-semibold text-4xl font-poppins text-black-light mb-6">
            Summary
          </h1>
          <Card
            color="bg-gray-100"
            containerClasses="w-full rounded-2xl p-6 shadow-xl"
          >
            <p className="font-poppins text-gray-400">Your blance</p>
            <h5 className="font-rale font-semibold text-4xl">
              {balance.substring(0, 7)} ETH
            </h5>
          </Card>
        </div>
        <div className="mb-32" />
        <h1 className="font-semibold text-4xl font-poppins text-black-light mb-6">
          Last royalties
        </h1>
        {/* <div className="w-full">
          {transactions?.allRoyalties?.map((royalty: any, index: number) => (
            <>
              <div
                className="flex flex-row justify-between items-center"
                key={index}
              >
                <div>
                  <p className="font-semibold font-poppins text-xl">
                    Barrel #{royalty?.tokenId}
                  </p>
                  <p className="font-poppins text-gray-500 text-sm">
                    {format(new Date(royalty?.createdAt), 'PP p')}
                  </p>
                </div>
                <p className="font-poppins text-xl font-bold text-black">
                  {ethers.utils.formatEther(royalty?.royalty)}ETH
                </p>
              </div>
              <div className="w-full border-b border-gray-500 my-3"></div>
            </>
          ))}
        </div> */}
      </ClientOnly>
    </div>
  )
}

export default RightSidebar
