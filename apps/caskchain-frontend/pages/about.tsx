import { BaseLayout } from '@ui'
import Spacer from '@ui/common/Spacer'
import Header from '@ui/layout/Header'
import BarrelsSection from 'components/pages/home/BarrelsSection'
import NewsletterSection from 'components/pages/home/NewsletterSection'

import { NextPage } from 'next'
import Image from 'next/image'

const About: NextPage = () => {
  return (
    <BaseLayout background="bg-white">
      <div>
        <div>
          <Header title="About Us" />
          <div className="grid grid-cols-3 bg-white py-20">
            <div
              className="flex w-full col-span-1 items-center justify-center
            "
            >
              <Image
                src="https://res.cloudinary.com/caskchain/image/upload/v1688555397/CaskChain/IMG_8898.png"
                width={400}
                height={400}
                alt="caskchain_about"
              />
            </div>
            <div className="flex flex-col col-span-2 items-start justify-center w-2/3">
              <h1 className="font-rale text-6xl font-bold">
                <span className="text-cask-chain">NFT Cask</span> Marketplace
                for brandy connoisseurs
              </h1>
              <Spacer size="md" />
              <p className="text-gray-500 text-lg font-popins font-light">
                CaskChain is a groundbreaking digital platform that unites the
                traditional world of spirits with innovative blockchain
                technology. This unique online marketplace empowers brandy
                enthusiasts and collectors worldwide to buy, sell, and trade
                non-fungible token (NFT) representations of real-world brandy
                casks. Each NFT represents actual ownership or share of a cask
                of brandy maturing in renowned distilleries across the globe.
                The marketplace offers complete transparency, ensuring each
                NFT’s provenance, rarity, and ownership is verified and
                immutable. By converging the intricate art of brandy-making with
                the digital frontier, the NFT Cask Marketplace for Brandy
                Connoisseurs opens up a fascinating new way to invest in and
                enjoy this cherished spirit.
              </p>
            </div>
          </div>
        </div>
        <div>
          <div className="w-full bg-black-light flex flex-col items-center py-20">
            <div className="flex flex-col items-center px-6 lg:px-0">
              <h2 className="font-rale text-cask-chain font-semibold text-4xl lg:text-5xl">
                How it Works
              </h2>
              <Spacer size="sm" />
              <p className="text-gray-500 text-center font-popins font-thin text-xl max-w-lg">
                we work quickly & with maximum security check out the video
                below to know how we work
              </p>
              <Spacer size="xl" />
              <div className="relative">
                <Image
                  src="/images/cellar.png"
                  width={1000}
                  height={500}
                  alt="cellar"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 w-20 h-20 rounded-full flex justify-center items-center">
                  <Image
                    src="/icons/play.png"
                    width={35}
                    height={35}
                    alt="play"
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
          <Image
            src="/images/wave1.svg"
            width={1000}
            height={500}
            alt="wave"
            className="w-full"
          />
        </div>
        <BarrelsSection />
        <NewsletterSection />
      </div>
    </BaseLayout>
  )
}

export default About
