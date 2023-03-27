import React from 'react'
import Image from 'next/image'
import Spacer from '@ui/common/Spacer'

interface SocialIconProps {
  width?: number
  height?: number
  social: string
}

const SocialIcon: React.FC<SocialIconProps> = ({ social, width, height }) => {
  return (
    <div className="w-10 h-10 bg-gray-700 flex justify-center items-center p-2 rounded-full">
      <Image
        src={`/icons/${social}.svg`}
        width={width || 18}
        height={height || 18}
        alt="twitter"
      />
    </div>
  )
}

const FooterSection = () => {
  return (
    <div>
      <Image
        src="/images/wave2.svg"
        width={1000}
        height={500}
        alt="wave"
        className="w-full"
      />
      <div className="grid grid-cols-2 bg-black-light px-32 pb-20">
        <div className="flex flex-col justify-center items-start">
          <Image src="/images/logo.svg" width={150} height={100} alt="logo" />
          <Spacer size="sm" />
          <p className="font-poppins text-gray-400 font-thin max-w-sm">
            Cask Chain is the new way to take your own cask in NFT world with
            profits in real life.
          </p>
          <Spacer size="sm" />
          <div className="flex flex-row space-x-4">
            <SocialIcon social="twitter" />
            <SocialIcon social="linkedin" />
            <SocialIcon social="facebook" width={10} height={10} />
            <SocialIcon social="youtube" />
            <SocialIcon social="instagram" />
          </div>
        </div>
        <div className="grid grid-cols-3">
          <div className="flex flex-col justify-center items-center" />
          <div className="flex flex-col justify-center items-center" />
          <div className="flex flex-col justify-center items-center" />
        </div>
      </div>
    </div>
  )
}

export default FooterSection
