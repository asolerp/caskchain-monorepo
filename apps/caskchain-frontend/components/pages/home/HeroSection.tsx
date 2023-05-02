import Button from '@ui/common/Button'
import Spacer from '@ui/common/Spacer'
import { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'

import { useGlobal } from '@providers/global'
import MarketPlaceStats from './MarketPlaceStats'

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
      <div className="h-full lg:h-screen w-screen bg-hero bg-cover grid grid-cols-3 sm:px-6 lg:px-32">
        <div className="flex flex-col w-full justify-center items-start col-span-3 lg:col-span-2 mt-32">
          <div className="hidden lg:flex lg:flex-col">
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
              <span className="text-cask-chain">
                own a piece of liquid story
              </span>
            </motion.h4>
          </div>
          <div className="flex flex-col w-full items-center lg:hidden">
            <motion.h1
              initial="hidden"
              animate={controls}
              variants={titleVariants}
              transition={{ duration: 1 }}
              className="font-rale text-5xl font-semibold leading-[56px] text-white text-center px-2"
            >
              Discover, collect, and take the best
              <span className="text-cask-chain"> NFT Cask</span>
            </motion.h1>
            <Spacer size="lg" />
            <motion.h4
              initial="hidden"
              animate={controls}
              variants={upperVariants}
              transition={{ duration: 1 }}
              className="text-neutral font-light leading-6 text-md text-center font-poppins px-4"
            >
              {`The world's first and largest NFT marketplace to `}
              <span className="text-cask-chain">
                own a piece of liquid story
              </span>
            </motion.h4>
          </div>
          <Spacer size="2xl" />
          <motion.div
            initial="hidden"
            animate={controls}
            variants={upperVariants}
            transition={{ duration: 1 }}
            className="flex flex-col w-full lg:flex-row px-6 lg:px-0 lg:space-x-4"
          >
            <Button
              containerStyle="px-12 py-4 lg:py-6 w-full lg:w-fit"
              labelStyle="text-xl text-center"
            >
              Explore
            </Button>
            <Spacer size="sm" />
            <Button
              containerStyle="px-12 py-4 lg:py-6 w-full lg:w-fit"
              labelStyle="text-xl text-center"
              active={false}
            >
              Create
            </Button>
          </motion.div>
          <Spacer size="2xl" />
          <div className="px-6 h-fi">
            <motion.div
              initial="hidden"
              animate={controls}
              variants={upperVariants}
              transition={{ duration: 1 }}
              className="
        bg-gray-400 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-5 grid grid-cols-3 divide-x space-x-3 py-6 "
            >
              <MarketPlaceStats />
            </motion.div>
            <Spacer size="xl" />
          </div>
        </div>
        <div />
      </div>
    </>
  )
}

export default HeroSection
