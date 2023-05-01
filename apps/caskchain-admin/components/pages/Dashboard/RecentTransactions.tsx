import { Table } from 'flowbite-react'
import { addressSimplifier } from 'caskchain-lib'

type RecentTransactionsProps = {
  transactions: any
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
}) => {
  return (
    <div className="flex w-full flex-col">
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
          {transactions?.allTransactions?.map((transaction: any, i) => {
            return (
              <Table.Row key={i} className="border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {transaction?.tokenId}
                </Table.Cell>
                <Table.Cell>{addressSimplifier(transaction?.from)}</Table.Cell>
                <Table.Cell>{addressSimplifier(transaction?.to)}</Table.Cell>
                <Table.Cell>{transaction?.type}</Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </div>
  )
}
export default RecentTransactions
