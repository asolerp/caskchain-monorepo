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
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
          <div className="py-2 inline-block min-w-full">
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th
                      align="center"
                      scope="col"
                      className="text-lg font-medium text-black px-6 py-4 text-left"
                    >
                      Barrel ID
                    </th>
                    <th
                      scope="col"
                      className="text-lg font-medium text-black px-6 py-4 text-left"
                    >
                      From
                    </th>
                    <th
                      scope="col"
                      className="text-lg font-medium text-black px-6 py-4 text-left"
                    >
                      To
                    </th>
                    <th
                      scope="col"
                      className="text-lg font-medium text-black px-6 py-4 text-left"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <>
                    {transactions &&
                      transactions?.allTransactions?.map(
                        (transaction: any, i: number) => {
                          return (
                            <tr key={i}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                                {transaction?.tokenId}
                              </td>
                              <td className="text-sm text-gray-600 font-light px-6 py-4 whitespace-nowrap">
                                {addressSimplifier(transaction?.from)}
                              </td>
                              <td className="text-sm text-gray-600 font-light px-6 py-4 whitespace-nowrap">
                                {addressSimplifier(transaction?.to)}
                              </td>
                              <td className="text-sm text-gray-600 font-light px-6 py-4 whitespace-nowrap">
                                {transaction?.type}
                              </td>
                            </tr>
                          )
                        }
                      )}
                  </>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* <Table className="bg-gray-700">
        <Table.Head className="border-red-400">
          <Table.HeadCell>Barrel ID</Table.HeadCell>
          <Table.HeadCell>From</Table.HeadCell>
          <Table.HeadCell>To</Table.HeadCell>
          <Table.HeadCell>Action</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {transactions?.allTransactions?.map((transaction: any, i: number) => {
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
      </Table> */}
    </div>
  )
}
export default RecentTransactions
