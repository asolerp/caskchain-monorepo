import { useStats } from '@hooks/web3'
import Card from '@ui/common/Card'

const ResumeStats = () => {
  const { stats } = useStats()

  return (
    <div className="flex w-full flex-col">
      <div className="w-full grid grid-cols-3 gap-8 mt-12 ">
        <Card color="bg-cask-chain">
          <p className="font-poppins font-normal text-2xl text-black dark:text-gray-400 mb-3">
            Users
          </p>
          <h5 className="font-rale text-4xl font-bold tracking-tight text-black dark:text-white">
            {stats?.totalUsers || 0}
          </h5>
        </Card>
        <Card color="bg-cask-chain">
          <p className="font-poppins font-normal text-2xl text-black dark:text-gray-400 mb-3">
            Income
          </p>
          <h5 className="font-rale text-4xl font-bold tracking-tight text-black dark:text-white">
            45.392 $
          </h5>
        </Card>
        <Card color="bg-cask-chain">
          <p className="font-poppins font-normal text-2xl text-black dark:text-gray-400 mb-3">
            NFT Minted
          </p>
          <h5 className="font-rale text-4xl font-bold tracking-tight text-black dark:text-white">
            {stats?.totalNfts || 0}
          </h5>
        </Card>
      </div>
    </div>
  )
}
export default ResumeStats
