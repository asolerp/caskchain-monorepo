import { auth } from 'utils/auth'

import ResumeStats from 'components/pages/Dashboard/ResumeStats'
import { useNftTransactions } from '@hooks/web3'
import { BaseLayout } from '@ui'
import RecentTransactions from 'components/pages/Dashboard/RecentTransactions'

export const getServerSideProps = (context: any) => auth(context, 'admin')

const Dashboard = () => {
  const { transactions } = useNftTransactions()

  return (
    <BaseLayout background="bg-gray-200">
      <div className="flex flex-col w-full  px-20 py-10">
        <h1 className="font-semibold text-4xl font-poppins text-black-light">
          Business Dashboard
        </h1>
        <ResumeStats />
        <div className="mb-32"></div>
        <RecentTransactions transactions={transactions} />
      </div>
    </BaseLayout>
  )
}

export default Dashboard
