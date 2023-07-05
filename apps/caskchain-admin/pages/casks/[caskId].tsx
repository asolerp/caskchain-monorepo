import { useCaskNft } from '@hooks/web3'
import { BaseLayout } from '@ui'
import { Button, Spacer } from 'caskchain-ui'
import { NextPageContext } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'

import ClientOnly from 'components/pages/ClientOnly'
import { auth } from 'utils/auth'
import { addressSimplifier, ipfsImageParser } from 'caskchain-lib'
import { Switch } from '@headlessui/react'
import { useEffect, useState } from 'react'

function Cask() {
  const route = useRouter()

  const { cask } = useCaskNft({ caskId: route.query.caskId as string })

  const [isInSale, setIsInSale] = useState(false)
  const [bestBarrel, setBestBarrel] = useState(false)

  useEffect(() => {
    if (cask?.data) {
      setIsInSale(cask?.data?.active)
      setBestBarrel(cask?.data?.bestBarrel)
    }
  }, [cask?.data])

  const mainImage =
    cask?.data?.meta?.image && ipfsImageParser(cask?.data?.meta?.image)

  if (cask?.isLoading || cask?.isValidating) {
    return (
      <BaseLayout background="bg-gray-200">
        <></>
      </BaseLayout>
    )
  }

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
          {true && (
            <>
              <Spacer size="xl" />
              <div>
                <div className="flex flex-col w-100">
                  <h1 className="font-semibold text-4xl font-poppins text-black-light mr-20">
                    Sale options
                  </h1>
                  <Spacer size="md" />
                  <div className="flex flex-row items-center">
                    <span className="mr-2 w-[150px]">Active for sale?</span>
                    <Switch
                      checked={isInSale}
                      onChange={() => {
                        setIsInSale(!isInSale)
                        cask?.updateNftSaleState(!isInSale)
                      }}
                      className={`${isInSale ? 'bg-cask-chain' : 'bg-gray-300'}
                      relative inline-flex flex-shrink-0 h-[28px] w-[64px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                      <span
                        aria-hidden="true"
                        className={`${
                          isInSale ? 'translate-x-9' : 'translate-x-0'
                        }
                      pointer-events-none inline-block h-[24px] w-[24px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                      />
                    </Switch>
                  </div>
                  <Spacer size="sm" />
                  <div className="flex flex-row items-center">
                    <span className="mr-2 w-[150px]">Is in best barrles?</span>
                    <Switch
                      checked={bestBarrel}
                      onChange={() => {
                        setBestBarrel(!bestBarrel)
                        cask?.updateNftBestBarel(!bestBarrel)
                      }}
                      className={`${
                        bestBarrel ? 'bg-cask-chain' : 'bg-gray-300'
                      }
                      relative inline-flex flex-shrink-0 h-[28px] w-[64px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                      <span
                        aria-hidden="true"
                        className={`${
                          bestBarrel ? 'translate-x-9' : 'translate-x-0'
                        }
                      pointer-events-none inline-block h-[24px] w-[24px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                      />
                    </Switch>
                  </div>
                </div>
                <Spacer size="lg" />
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
                        ETH
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
                        Update price in ETH
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
                  <dt className="text-md font-medium text-gray-400">
                    {attribute.trait_type.toUpperCase()}
                  </dt>
                  <Spacer size="xs" />
                  <dd className=" text-lg font-extrabold text-black">
                    {attribute.value}
                  </dd>
                </div>
              ))}
            </div>
          </div>
          <Spacer size="xl" />
          <div>
            <h1 className="font-semibold text-4xl font-poppins text-black-light">
              Fractions
            </h1>
            <Spacer size="md" />
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xl font-medium text-gray-700"
                >
                  Fraction name
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    value={cask.formState.tokenName}
                    onChange={cask.handleFormFractionsChange}
                    type="text"
                    name="tokenName"
                    id="name"
                    className="w-full bg-transparent mt-2 text-xl text-black focus:ring-0 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                    placeholder="My Nice NFT"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="block text-xl font-medium text-gray-700"
                >
                  Fraction symbol
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    value={cask.formState.tokenSymbol}
                    onChange={cask.handleFormFractionsChange}
                    type="text"
                    name="tokenSymbol"
                    id="name"
                    className="w-full bg-transparent mt-2 text-xl text-black focus:ring-0 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                    placeholder="My Nice NFT"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="block text-xl font-medium text-gray-700"
                >
                  Supply
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    value={cask.formState.tokenSupply}
                    onChange={cask.handleFormFractionsChange}
                    type="number"
                    name="tokenSupply"
                    id="name"
                    className="w-full bg-transparent mt-2 text-xl text-black focus:ring-0 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                    placeholder="My Nice NFT"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="block text-xl font-medium text-gray-700"
                >
                  Fee
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    value={cask.formState.tokenFee}
                    onChange={cask.handleFormFractionsChange}
                    type="number"
                    name="tokenFee"
                    id="name"
                    className="w-full bg-transparent mt-2 text-xl text-black focus:ring-0 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                    placeholder="My Nice NFT"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="block text-xl font-medium text-gray-700"
                >
                  Listing price
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    value={cask.formState.tokenListingPrice}
                    onChange={cask.handleFormFractionsChange}
                    type="number"
                    name="tokenListingPrice"
                    id="name"
                    className="w-full bg-transparent mt-2 text-xl text-black focus:ring-0 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                    placeholder="My Nice NFT"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-6">
              <Button onClick={cask.createFraction}>Create fractions</Button>
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
