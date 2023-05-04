import type { NextPage } from 'next'

import { BaseLayout } from '@ui'
import { Switch } from '@headlessui/react'
import Link from 'next/link'

// import axios from 'axios'
// import { useWeb3 } from '@providers/web3'
// import { toast } from 'react-toastify'
// import { ethers } from 'ethers'

import { Button, Spacer } from 'caskchain-ui'

import { auth } from 'utils/auth'
import Image from 'next/image'
import upperCaseFirstLetter from 'utils/upperCaseFirstLetter'
import { useCreateNft } from '@hooks/web3'
// import { getSignedData } from 'pages/api/utils'

type LiquorFilterProps = {
  label: string
  isActive: boolean
  onClick: () => void
}

const LiquorFilter: React.FC<LiquorFilterProps> = ({
  label,
  isActive,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`${
        isActive ? 'bg-cask-chain' : 'bg-white ring-2 ring-cask-chain'
      } p-4 flex items-center justify-center w-fit rounded-full cursor-pointer`}
    >
      <p className={`${isActive ? 'text-black' : 'text-gray-500'}`}>{label}</p>
    </div>
  )
}

export const getServerSideProps = (context: any) => auth(context, 'admin')

const NftCreate: NextPage = () => {
  const {
    nft: {
      nftURI,
      hasURI,
      nftMeta,
      setHasURI,
      setNftURI,
      price,
      setPrice,
      nftImage,
      activeLiquor,
      uploadMetaData,
      createNft,
      handleImage,
      handleChange,
      handleAttributeChange,
      handleActiveLiquorChange,
    },
  } = useCreateNft()

  return (
    <BaseLayout background="bg-gray-200">
      <div className="flex flex-col w-full px-20 py-10">
        <h1 className="font-semibold text-4xl font-poppins text-black-light">
          Create new Barrel NFT
        </h1>
        <Spacer size="lg" />

        <div className="py-4">
          {!nftURI && (
            <div className="flex">
              <div className="mr-4 text-lg font-semibold font-poppins underline">
                Do you have meta data already?
              </div>
              <Switch
                checked={hasURI}
                onChange={() => setHasURI(!hasURI)}
                className={`${hasURI ? 'bg-cask-chain' : 'bg-gray-300'}
                  relative inline-flex flex-shrink-0 h-[28px] w-[64px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`${hasURI ? 'translate-x-9' : 'translate-x-0'}
                    pointer-events-none inline-block h-[24px] w-[24px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                />
              </Switch>
            </div>
          )}
        </div>
        {nftURI || hasURI ? (
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-3">
              <div className="px-4 sm:px-0">
                <h3 className="text-2xl font-medium font-poppins leading-6 text-gray-900">
                  List NFT
                </h3>
                <p className="mt-1 text-lg text-gray-600">
                  This information will be displayed publicly so be careful what
                  you share.
                </p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-3">
              <form>
                <div className="sm:rounded-md sm:overflow-hidden">
                  {hasURI && (
                    <div className=" py-5 space-y-6">
                      <div>
                        <label
                          htmlFor="uri"
                          className="block text-xl font-medium text-gray-700"
                        >
                          URI Link
                        </label>
                        <div className="mt-1 flex rounded-md ">
                          <input
                            onChange={(e) => setNftURI(e.target.value)}
                            type="text"
                            name="uri"
                            id="uri"
                            className="w-full bg-transparent mt-2 text-xl text-black focus:ring-0 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                            placeholder="http://link.com/data.json"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {nftURI && (
                    <div className="mb-4">
                      <div className="font-bold">Your metadata: </div>
                      <div>
                        <Link href={nftURI}>
                          <span className="underline text-indigo-600">
                            {nftURI}
                          </span>
                        </Link>
                      </div>
                    </div>
                  )}
                  <div className="py-5 space-y-6">
                    <div>
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Price (ETH)
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          onChange={(e) => setPrice(e.target.value)}
                          value={price}
                          type="number"
                          name="price"
                          id="price"
                          className="w-full bg-transparent mt-2 text-xl text-black focus:ring-0 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                          placeholder="0.8"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="py-3 text-right">
                    <Button
                      containerStyle="px-14 py-3 rounded-full"
                      onClick={createNft}
                    >
                      List
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-3">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium font-poppins leading-6 text-gray-900">
                  Create NFT Metadata
                </h3>
                <p className="mt-1 text-sm text-gray-600 font-poppins">
                  This information will be displayed publicly so be careful what
                  you share.
                </p>
              </div>
            </div>
            <div className="md:mt-0 md:col-span-3">
              <div className="flex flex-row space-x-4">
                <LiquorFilter
                  label="Brandy"
                  isActive={activeLiquor === 'brandy'}
                  onClick={() => handleActiveLiquorChange('brandy')}
                />
                <LiquorFilter
                  label="Rum"
                  isActive={activeLiquor === 'rum'}
                  onClick={() => handleActiveLiquorChange('rum')}
                />
                <LiquorFilter
                  label="Whiskey"
                  isActive={activeLiquor === 'whiskey'}
                  onClick={() => handleActiveLiquorChange('whiskey')}
                />
                <LiquorFilter
                  label="Tequila"
                  isActive={activeLiquor === 'tequila'}
                  onClick={() => handleActiveLiquorChange('tequila')}
                />
              </div>
              <form>
                <div className=" sm:rounded-md sm:overflow-hidden">
                  <div className="py-5 space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xl font-medium text-gray-700"
                      >
                        Name
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          value={nftMeta.name}
                          onChange={handleChange}
                          type="text"
                          name="name"
                          id="name"
                          className="w-full bg-transparent mt-2 text-xl text-black focus:ring-0 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg"
                          placeholder="My Nice NFT"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-xl font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          value={nftMeta.description}
                          onChange={handleChange}
                          id="description"
                          name="description"
                          rows={3}
                          className="w-full bg-transparent mt-2 text-md text-gray-600 focus:ring-0 focus:border-blue-700 rounded-lg"
                          placeholder="Some nft description..."
                        />
                      </div>
                      <p className="mt-2 text-xl text-gray-500">
                        Brief description of NFT
                      </p>
                    </div>
                    {nftImage ? (
                      <div className="h-full">
                        <Image
                          width={500}
                          height={400}
                          src={nftImage}
                          className="rounded-xl"
                          alt=""
                        />
                        <Spacer size="lg" />
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-cask-chain rounded-full px-3 py-3 font-medium text-black hover:text-black focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 text-lg font-poppins "
                        >
                          <span>Change image</span>
                          <input
                            onChange={handleImage}
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                          />
                        </label>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xl font-medium text-gray-700">
                          Image
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex items-center text-xl text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-cask-chain rounded-md px-2 py-2 font-medium text-gray-700 hover:text-black focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                              >
                                <span>Upload a file</span>
                                <input
                                  onChange={handleImage}
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div>
                      <h2 className="font-poppins text-2xl text-black mt-14">
                        Attributes
                      </h2>
                      <Spacer size="lg" />
                      <div className="grid grid-cols-6 gap-6">
                        {nftMeta.attributes.map((attribute: any) => (
                          <div
                            key={attribute.trait_type}
                            className="col-span-6 sm:col-span-6 lg:col-span-2"
                          >
                            <label
                              htmlFor={attribute.trait_type}
                              className="block text-xl font-medium text-gray-700"
                            >
                              {upperCaseFirstLetter(attribute.trait_type)}
                            </label>
                            <input
                              disabled={!attribute.editable}
                              value={attribute.value}
                              onChange={handleAttributeChange}
                              type={attribute.type}
                              name={attribute.trait_type}
                              id={attribute.trait_type}
                              className="w-full bg-transparent mt-2 text-xl text-black focus:ring-0 focus:border-blue-700 rounded-lg"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="py-3 text-right ">
                    <Button
                      containerStyle="px-14 py-3 rounded-full"
                      onClick={uploadMetaData}
                    >
                      LIST NFT
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </BaseLayout>
  )
}

export default NftCreate
