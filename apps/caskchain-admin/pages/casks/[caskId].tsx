import { useAccount, useCaskNft } from '@hooks/web3'
import { BaseLayout } from '@ui'
import { Button, Spacer } from 'caskchain-ui'
import { NextPageContext } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import { useBalance } from 'wagmi'
import ClientOnly from 'components/pages/ClientOnly'
import { auth } from 'utils/auth'
import { addressSimplifier, ipfsImageParser } from 'caskchain-lib'

function Cask() {
  const route = useRouter()
  const { account } = useAccount()
  const { cask } = useCaskNft({ caskId: route.query.caskId as string })
  const { data } = useBalance({
    address: account?.data,
  })

  const mainImage =
    cask?.data?.meta?.image && ipfsImageParser(cask?.data?.meta?.image)

  return (
    <ClientOnly>
      <BaseLayout background="bg-gray-200">
        <div className="flex flex-col w-full   px-20 py-10">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center justify-center">
              <Image
                src={mainImage}
                width={500}
                height={500}
                alt={cask?.data?.meta?.name}
                className="rounded-xl object-contain"
              ></Image>
            </div>
            <div className="flex flex-col justify-start w-full">
              <div className="flex flex-row items-center space-x-4">
                <h4 className="font-poppins font-bold text-gray-400">
                  Cask #{cask?.data?.tokenId}
                </h4>
                <h4 className="font-poppins font-bold text-yellow-400 text-lg">
                  {cask?.data?.owner?.nickname
                    ? `@${cask?.data?.owner?.nickname}`
                    : `${addressSimplifier(cask?.data?.owner?.address)}`}
                </h4>
              </div>
              <h1 className="font-semibold text-4xl font-poppins text-black-light">
                {cask?.data?.meta?.name}
              </h1>
              <Spacer size="sm" />
              <p className="font-poppins text-md">
                {cask?.data?.meta?.description}
              </p>
            </div>
          </div>
          {cask?.data?.creator.toLowerCase() ===
            cask?.data?.owner?.address.toLowerCase() && (
            <>
              <Spacer size="xl" />
              <div>
                <h1 className="font-semibold text-4xl font-poppins text-black-light">
                  Sale options
                </h1>
                <Spacer size="md" />
                <div className="flex flex-col">
                  <div className="flex flex-row space-x-5">
                    <div className="flex flex-col">
                      <dt className="text-xl font-medium text-gray-400">
                        Price
                      </dt>
                      <Spacer size="xs" />
                      <dd className=" text-2xl font-extrabold text-black">
                        {cask?.data?.price &&
                          ethers.utils.formatEther(cask?.data?.price)}{' '}
                        {data?.symbol}
                      </dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="text-xl font-medium text-gray-400">
                        Price Dolars
                      </dt>
                      <Spacer size="xs" />
                      <dd className=" text-2xl font-extrabold text-black">
                        {cask?.data?.erc20Prices?.USDT &&
                          ethers.utils.formatEther(
                            cask?.data?.erc20Prices?.USDT
                          )}
                        $
                      </dd>
                    </div>
                  </div>
                  <Spacer size="sm" />
                  <div className="flex flex-row space-x-5">
                    <div>
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Update price in ({data?.symbol})
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          onChange={(e) => cask.setListPrice(e.target.value)}
                          value={cask.listPrice}
                          type="number"
                          name="price"
                          id="price"
                          className="w-full bg-transparent mt-2 text-xl text-black focus:ring-0 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                          placeholder="0.8"
                        />
                      </div>
                      <Spacer size="sm" />
                      <Button onClick={cask.updateNftPrice}>
                        Update price
                      </Button>
                    </div>
                    <div>
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Update price in dolars
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          onChange={(e) =>
                            cask.setERC20ListPrice(e.target.value)
                          }
                          value={cask.erc20ListPrices}
                          type="number"
                          name="price"
                          id="price"
                          className="w-full bg-transparent mt-2 text-xl text-black focus:ring-0 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                          placeholder="0.8"
                        />
                      </div>
                      <Spacer size="sm" />
                      <Button onClick={cask.updateERC20Price}>
                        Update price
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <Spacer size="xl" />
          <div>
            <h1 className="font-semibold text-4xl font-poppins text-black-light">
              Attributes
            </h1>
            <div className="grid grid-cols-4 gap-4 mt-6">
              {cask?.data?.meta?.attributes?.map((attribute: any) => (
                <div
                  key={attribute.trait_type}
                  className="flex flex-col bg-cask-chain rounded-xl p-4 shadow"
                >
                  <dt className="text-xl font-medium text-gray-400">
                    {attribute.trait_type.toUpperCase()}
                  </dt>
                  <Spacer size="xs" />
                  <dd className=" text-2xl font-extrabold text-black">
                    {attribute.value}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </BaseLayout>
    </ClientOnly>
  )
}

export default Cask

export const getServerSideProps: any = async (context: NextPageContext) => {
  const { query } = context
  return auth(context, 'admin', { props: { query } })
}
