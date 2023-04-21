import { auth } from 'utils/auth'

import ResumeStats from 'components/pages/Dashboard/ResumeStats'
import { Table } from 'flowbite-react'
import { useNftTransactions } from '@hooks/web3'
import { addressSimplifier } from 'utils/addressSimplifier'
import { BaseLayout } from '@ui'

export const getServerSideProps = (context: any) => auth(context, 'admin')

const Dashboard = () => {
  const { transactions } = useNftTransactions()

  return (
    <BaseLayout background="bg-gray-200">
      <div className="flex flex-col w-full  px-20 py-10">
        <ResumeStats />
        <div className="mb-32"></div>
        <h1 className="font-semibold text-4xl font-poppins text-black-light">
          Recent transfers
        </h1>
        <div className="mb-10"></div>
        <Table>
          <Table.Head className="border-gray-700 bg-gray-200">
            <Table.HeadCell>Barrel ID</Table.HeadCell>
            <Table.HeadCell>From</Table.HeadCell>
            <Table.HeadCell>To</Table.HeadCell>
            <Table.HeadCell>Action</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {transactions?.allTransactions?.map((transaction: any) => {
              return (
                <Table.Row className="border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {transaction?.tokenId}
                  </Table.Cell>
                  <Table.Cell>
                    {addressSimplifier(transaction?.from)}
                  </Table.Cell>
                  <Table.Cell>{addressSimplifier(transaction?.to)}</Table.Cell>
                  <Table.Cell>{transaction?.type}</Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </div>
    </BaseLayout>
  )
}

export default Dashboard
