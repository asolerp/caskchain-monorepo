import React from 'react'
import Image from 'next/image'
import Spacer from '@ui/common/Spacer'
import SubscriptionForm from 'components/forms/SubscriptionForm'
import Link from 'next/link'

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
        className="w-18 h-18"
        alt="twitter"
      />
    </div>
  )
}

const FooterSection = () => {
  return (
    <div className="flex flex-col">
      <Image
        src="/images/wave2.svg"
        width={300}
        height={500}
        alt="wave"
        className=" lg:scale-x-100 w-auto h-auto"
      />
      <div className="grid grid-cols-2 bg-black-light px-6 lg:px-32 lg:pb-20 pt-10 lg:pt-0">
        <div className="flex col-span-2 lg:col-span-1  flex-col justify-center items-start">
          <Image
            src="/images/logo.svg"
            width={150}
            height={100}
            alt="logo"
            className="w-auto h-auto"
          />
          <Spacer size="sm" />
          <p className="font-poppins text-gray-400 font-thin max-w-sm">
            Cask Chain is the new way to take your own cask in NFT world with
            profits in real life.
          </p>
          <Spacer size="sm" />
          <div className="flex flex-row space-x-4">
            {/* <SocialIcon social="twitter" />
            <SocialIcon social="linkedin" />
            <SocialIcon social="facebook" width={10} height={10} />
            <SocialIcon social="youtube" /> */}
            <SocialIcon social="instagram" />
          </div>
        </div>
        <div className="grid col-span-2 lg:col-span-1 grid-cols-3 gap-4 lg:gap-0 mt-10 lg:mt-0">
          <div className="flex flex-col col-span-3 lg:col-span-1 justify-start items-start">
            <h4 className="font-poppins text-white font-medium text-xl">
              Company
            </h4>
            <Spacer size="sm" />
            <div className="space-y-2">
              <Link href="/about" passHref>
                <p className="font-poppins text-gray-400 font-thin text-lg">
                  About us
                </p>
              </Link>
            </div>
          </div>
          <div className="flex flex-col col-span-3 lg:col-span-1 justify-start items-start">
            <h4 className="font-poppins text-white font-medium text-xl">
              Support
            </h4>
            <Spacer size="sm" />
            <div className="space-y-2">
              <p className="font-poppins text-gray-400 font-thin text-lg">
                Help center
              </p>
              <p className="font-poppins text-gray-400 font-thin text-lg">
                Terms of service
              </p>
              <p className="font-poppins text-gray-400 font-thin text-lg">
                Legal
              </p>
              <p className="font-poppins text-gray-400 font-thin text-lg">
                Privacy policy
              </p>
            </div>
          </div>
          <div className="flex flex-col col-span-3 lg:col-span-1 justify-start items-start">
            <SubscriptionForm />
          </div>
        </div>
        <Spacer size="xl" />
      </div>
      <div className="bg-black-light w-full h-20 flex items-center justify-center ">
        <p className="font-poppins text-gray-600 text-sm">
          © 2023 Cask Chain All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default FooterSection
