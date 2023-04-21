import { useAccount } from '@hooks/web3'
import Card from '@ui/common/Card'
import ClientOnly from 'components/pages/ClientOnly'
import { useBalance } from 'wagmi'

const RightSidebar = () => {
  const { account } = useAccount()

  const { data } = useBalance({
    address: account?.data,
  })

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
            {account && data && (
              <h5 className="font-rale font-semibold text-4xl">
                {Number(data?.formatted).toFixed(3)}{' '}
                <span className="text-lg">{data?.symbol}</span>
              </h5>
            )}
          </Card>
        </div>
      </ClientOnly>
    </div>
  )
}

export default RightSidebar
