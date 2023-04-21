import { useStats } from '@hooks/web3'
import Card from '@ui/common/Card'

const ResumeStats = () => {
  const { stats } = useStats()

  return (
    <div className="flex w-full flex-col">
      <h1 className="font-semibold text-4xl font-poppins text-black-light">
        Business Dashboard
      </h1>
      <div className="w-full grid grid-cols-3 gap-8 mt-12 ">
        <Card color="bg-gray-600">
          <p className="font-poppins font-normal text-2xl text-gray-200 dark:text-gray-400 mb-3">
            Users
          </p>
          <h5 className="font-rale text-4xl font-bold tracking-tight text-white dark:text-white">
            {stats?.totalUsers || 0}
          </h5>
        </Card>
        <Card color="bg-gray-600">
          <p className="font-poppins font-normal text-2xl text-gray-200 dark:text-gray-400 mb-3">
            Income
          </p>
          <h5 className="font-rale text-4xl font-bold tracking-tight text-white dark:text-white">
            45.392 $
          </h5>
        </Card>
        <Card color="bg-gray-600">
          <p className="font-poppins font-normal text-2xl text-gray-200 dark:text-gray-400 mb-3">
            NFT Minted
          </p>
          <h5 className="font-rale text-4xl font-bold tracking-tight text-white dark:text-white">
            {stats?.totalNfts || 0}
          </h5>
        </Card>
      </div>
    </div>
  )
}
export default ResumeStats
