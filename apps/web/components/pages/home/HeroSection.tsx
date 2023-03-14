import Button from '@ui/common/Button'
import Spacer from '@ui/common/Spacer'
import React from 'react'
import formatNumber from 'utils/formatNumber'

const HeroSection = () => {
  return (
    <div className="h-screen w-screen bg-hero bg-cover grid grid-cols-3 sm:px-6 lg:px-32">
      <div className="flex flex-col justify-center items-start col-span-2">
        <h1 className="font-rale text-8xl font-semibold text-white">
          <span className="text-cask-chain">NFT Cask</span> Marketplace for
          brandy connoisseurs
        </h1>
        <Spacer size="lg" />
        <h4 className="text-neutral font-light leading-9 text-2xl font-poppins w-3/5">
          Secure, blockchain-based marketplace that brings together the best
          casks from around the world, making it easier tha ever for you to{' '}
          <span className="text-cask-chain">own a piece of liquid story</span>
        </h4>
        <Spacer size="2xl" />
        <div className="flex flex-row space-x-4">
          <Button>Explore</Button>
          <Button active={false}>Create</Button>
        </div>
        <Spacer size="2xl" />
        <div
          className="
        bg-gray-400 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-5  grid grid-cols-3 divide-x py-6"
        >
          <div className="px-8 flex flex-col items-center space-y-2">
            <p className="text-4xl font-rale font-semibold text-cask-chain">
              {formatNumber(12000)}
            </p>
            <span className="text-white text-sm font-thin font-poppins">
              Wallets
            </span>
          </div>
          <div className="px-8 flex flex-col items-center space-y-2">
            <p className="text-4xl font-rale font-semibold text-cask-chain">
              {formatNumber(10)}
            </p>
            <span className="text-white text-sm font-thin font-poppins">
              Brands
            </span>
          </div>
          <div className="px-8 flex flex-col items-center space-y-2">
            <p className="text-4xl font-rale font-semibold text-cask-chain">
              {formatNumber(200)}
            </p>
            <span className="text-white text-sm font-thin font-poppins">
              Casks
            </span>
          </div>
        </div>
      </div>
      <div />
    </div>
  )
}

export default HeroSection
