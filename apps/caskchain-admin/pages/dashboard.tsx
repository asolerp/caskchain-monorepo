import { auth } from 'utils/auth'

import ResumeStats from 'components/pages/Dashboard/ResumeStats'

import { BaseLayout } from '@ui'
// import RecentTransactions from 'components/pages/Dashboard/RecentTransactions'

import { useNftTransactions } from '@hooks/web3/useNftTransactions'

export const getServerSideProps = (context: any) => auth(context, true)

const Dashboard = () => {
  useNftTransactions()

  return (
    <BaseLayout background="bg-gray-200">
      <div className="flex flex-col w-full  px-20 py-10">
        <h1 className="font-semibold text-4xl font-poppins text-black-light">
          Business Dashboard
        </h1>
        <ResumeStats />
        <div className="mb-32"></div>
        {/* <RecentTransactions transactions={transactions} /> */}
      </div>
    </BaseLayout>
  )
}

export default Dashboard
