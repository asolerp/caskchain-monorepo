import Button from '@ui/common/Button'
import Spacer from '@ui/common/Spacer'
import React, { useEffect } from 'react'
import formatNumber from 'utils/formatNumber'
import { motion, useAnimation } from 'framer-motion'

import { useGlobal } from '@providers/global'

const HeroSection = () => {
  const {
    state: { mainAnimationFinished },
  } = useGlobal()

  const controls = useAnimation()
  useEffect(() => {
    if (mainAnimationFinished) {
      controls.start('visible')
    }
  }, [mainAnimationFinished])

  const titleVariants = {
    visible: { x: 0, opacity: 1 },
    hidden: { x: -100, opacity: 0 },
  }

  const upperVariants = {
    visible: { y: 0, opacity: 1 },
    hidden: { y: 10, opacity: 0 },
  }

  return (
    <>
      <div className="h-screen w-screen bg-hero bg-cover grid grid-cols-3 sm:px-6 lg:px-32">
        <div className="flex flex-col justify-center items-start col-span-2 mt-32">
          <motion.h1
            initial="hidden"
            animate={controls}
            variants={titleVariants}
            transition={{ duration: 1 }}
            className="font-rale lg:text-[95px] leading-[110px] font-semibold text-white"
          >
            <span className="text-cask-chain">NFT Cask</span> Marketplace for
            brandy connoisseurs
          </motion.h1>
          <Spacer size="lg" />
          <motion.h4
            initial="hidden"
            animate={controls}
            variants={upperVariants}
            transition={{ duration: 1 }}
            className="text-neutral font-light leading-9 text-2xl font-poppins w-3/5"
          >
            Secure, blockchain-based marketplace that brings together the best
            casks from around the world, making it easier tha ever for you to{' '}
            <span className="text-cask-chain">own a piece of liquid story</span>
          </motion.h4>
          <Spacer size="2xl" />
          <motion.div
            initial="hidden"
            animate={controls}
            variants={upperVariants}
            transition={{ duration: 1 }}
            className="flex flex-row space-x-4"
          >
            <Button containerStyle="px-12 py-6" labelStyle="text-xl">
              Explore
            </Button>
            <Button
              containerStyle="px-12 py-6"
              labelStyle="text-xl"
              active={false}
            >
              Create
            </Button>
          </motion.div>
          <Spacer size="2xl" />
          <motion.div
            initial="hidden"
            animate={controls}
            variants={upperVariants}
            transition={{ duration: 1 }}
            className="
        bg-gray-400 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-5  grid grid-cols-3 divide-x py-6"
          >
            <div className="px-8 flex flex-col items-center space-y-2">
              <p className="text-6xl font-rale font-semibold text-cask-chain">
                {formatNumber(12000)}
              </p>
              <span className="text-white text-lg font-thin font-poppins">
                Wallets
              </span>
            </div>
            <div className="px-8 flex flex-col items-center space-y-2">
              <p className="text-6xl font-rale font-semibold text-cask-chain">
                {formatNumber(10)}
              </p>
              <span className="text-white text-lg font-thin font-poppins">
                Brands
              </span>
            </div>
            <div className="px-8 flex flex-col items-center space-y-2">
              <p className="text-6xl font-rale font-semibold text-cask-chain">
                {formatNumber(200)}
              </p>
              <span className="text-white text-lg font-thin font-poppins">
                Casks
              </span>
            </div>
          </motion.div>
        </div>
        <div />
      </div>
    </>
  )
}

export default HeroSection
