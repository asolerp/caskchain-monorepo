import Button from '@ui/common/Button'
import Spacer from '@ui/common/Spacer'
import Image from 'next/image'
import React from 'react'

type OwnerTipProps = {
  imgSrc: string
  title: string
  subtitle: string
}

const OwnerTip: React.FC<OwnerTipProps> = ({ imgSrc, title, subtitle }) => {
  return (
    <div className="rounded-3xl bg-[#292929] flex flex-col space-y-4 items-center justify-start p-4 py-6 w-[298px]">
      <Image
        src={imgSrc}
        alt=""
        width={100}
        height={100}
        className="rounded-full w-14 h-14 object-cover"
      />

      <h3 className="text-white text-2xl font-semibold text-center font-rale w-2/3">
        {title}
      </h3>
      <p className="text-gray-500 text-center font-poppins px-2">{subtitle}</p>
    </div>
  )
}

const OwnerSection = () => {
  return (
    <div>
      <div className="w-full bg-black-light flex flex-col items-center py-20">
        <h2 className="font-rale text-white text-center lg:text-left font-semibold text-4xl lg:text-5xl">
          How To Be Owner
        </h2>
        <Spacer size="lg" />
        <div className="flex flex-col space-y-5 lg:flex-row lg:space-x-5">
          <OwnerTip
            imgSrc="/images/owner_tip1.png"
            title="Set up your wallet"
            subtitle="Once you’ve set up your wallet of choice, connect it to OpenSea by clicking the wallet icon in the top right corner. Learn about the wallets we support."
          />
          <OwnerTip
            imgSrc="/images/owner_tip2.png"
            title="Buy your NFTs"
            subtitle="Choose your barrels according to the preferences and characteristics in the description. All wineries update the qualities of their content."
          />
          <OwnerTip
            imgSrc="/images/owner_tip3.png"
            title="List them for sale"
            subtitle="Choose between auctions, fixed-price listings, and declining-price listings. You choose how you want to sell your NFTs, and we help you sell them!"
          />
        </div>
        <Spacer size="2xl" />
        <Spacer size="2xl" />
        <div className="flex flex-col lg:hidden items-center bg-white w-full py-20">
          <Image src="/images/cc.png" alt="" width={280} height={340} />
          <Button labelStyle="text-md">Set up Now</Button>
        </div>
        <div className="hidden lg:flex relative bg-bg_owner bg-cover bg-center bg-no-repeat h-[600px] w-full flex-col items-center justify-center">
          <div className="absolute right-32 flex flex-col items-center w-72 p-6 bg-gray-400 rounded-[30px] bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10">
            <h3 className="font-rale font-medium text-white text-3xl text-center">
              Now you can be a pionner in the digital world of spirit
            </h3>
            <Spacer size="md" />
            <Button labelStyle="text-md">Set up Now</Button>
          </div>
        </div>

        <Spacer size="2xl" />
        <Spacer size="2xl" />
        <div className="flex flex-col items-center px-6 lg:px-0">
          <h2 className="font-rale text-white font-semibold text-4xl lg:text-5xl">
            Meet CaskChain
          </h2>
          <Spacer size="sm" />
          <p className="text-gray-400 text-center font-popins font-thin text-xl max-w-lg">
            we work quickly & with maximum security check out the video below to
            know how we work
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
  )
}

export default OwnerSection
