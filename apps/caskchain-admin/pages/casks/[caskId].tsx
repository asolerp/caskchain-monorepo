import { BaseLayout } from '@ui'
import { Button, Spacer } from 'caskchain-ui'

import Image from 'next/image'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'

import ClientOnly from 'components/pages/ClientOnly'
import { auth } from 'utils/auth'
import { addressSimplifier, ipfsImageParser } from 'caskchain-lib'
import { Switch } from '@headlessui/react'

import { useCaskNft } from '@hooks/web3/useCaskNft'

export const getServerSideProps = (context: any) => auth(context, true)

function Cask() {
  const route = useRouter()

  const {
    data,
    isInSale,
    formState,
    isLoading,
    listPrice,
    bestBarrel,
    setIsInSale,
    setListPrice,
    isValidating,
    setBestBarrel,
    updateNftPrice,
    createFraction,
    erc20ListPrice,
    updateERC20Price,
    updateNftSaleState,
    setERC20ListPrice,
    handleFormFractionsChange,
    updateNftBestBarel,
  } = useCaskNft({
    caskId: route.query.caskId as string,
  })

  const mainImage = data?.meta?.image && ipfsImageParser(data?.meta?.image)

  if (isLoading || isValidating) {
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
                alt={data?.meta?.name}
                className="rounded-xl object-contain"
                priority={true}
                quality={100}
              ></Image>
            </div>
            <div className="flex flex-col justify-start w-full">
              <div className="flex flex-row items-center space-x-4">
                <h4 className="font-poppins font-bold text-gray-400">
                  Cask #{data?.tokenId}
                </h4>
                <h4 className="font-poppins font-bold text-yellow-400 text-lg">
                  {data?.owner?.nickname
                    ? `@${data?.owner?.nickname}`
                    : `${addressSimplifier(data?.owner?.address)}`}
                </h4>
              </div>
              <h1 className="font-semibold text-4xl font-poppins text-black-light">
                {data?.meta?.name}
              </h1>
              <Spacer size="sm" />
              <p className="font-poppins text-md">{data?.meta?.description}</p>
            </div>
          </div>
          {data?.creator?.toLowerCase() ===
            data?.owner?.address.toLowerCase() && (
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
                        updateNftSaleState(!isInSale)
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
                        updateNftBestBarel(!bestBarrel)
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
                        {data?.price && ethers.utils.formatEther(data?.price)}{' '}
                        MATIC
                      </dd>
                    </div>
                    <div className="flex flex-col">
                      <dt className="text-xl font-medium text-gray-400">
                        Price Dolars
                      </dt>
                      <Spacer size="xs" />
                      <dd className=" text-2xl font-extrabold text-black">
                        {data?.erc20Prices?.USDT &&
                          ethers.utils.formatEther(data?.erc20Prices?.USDT)}
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
                        Update price in MATIC
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          onChange={(e: any) => setListPrice(e.target.value)}
                          value={listPrice}
                          type="number"
                          name="price"
                          id="price"
                          className="w-full bg-transparent mt-2 text-xl text-black focus:ring-0 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                          placeholder="0.8"
                        />
                      </div>
                      <Spacer size="sm" />
                      <Button onClick={updateNftPrice}>Update price</Button>
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
                          onChange={(e: any) =>
                            setERC20ListPrice(e.target.value)
                          }
                          value={erc20ListPrice}
                          type="number"
                          name="price"
                          id="price"
                          className="w-full bg-transparent mt-2 text-xl text-black focus:ring-0 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                          placeholder="0.8"
                        />
                      </div>
                      <Spacer size="sm" />
                      <Button onClick={updateERC20Price}>Update price</Button>
                    </div>
                  </div>
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
                        value={formState.tokenName}
                        onChange={handleFormFractionsChange}
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
                        value={formState.tokenSymbol}
                        onChange={handleFormFractionsChange}
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
                        value={formState.tokenSupply}
                        onChange={handleFormFractionsChange}
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
                        value={formState.tokenFee}
                        onChange={handleFormFractionsChange}
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
                        value={formState.tokenListingPrice}
                        onChange={handleFormFractionsChange}
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
                  <Button onClick={createFraction}>Create fractions</Button>
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
              {Object.entries(data?.meta?.attributes)?.map(
                ([attribute, value]: any) => (
                  <div
                    key={attribute}
                    className="flex flex-col bg-cask-chain rounded-xl p-4 shadow"
                  >
                    <dt className="text-md font-medium text-gray-400">
                      {attribute.toUpperCase()}
                    </dt>
                    <Spacer size="xs" />
                    <dd className=" text-lg font-extrabold text-black">
                      {value}
                    </dd>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </BaseLayout>
    </ClientOnly>
  )
}

export default Cask
