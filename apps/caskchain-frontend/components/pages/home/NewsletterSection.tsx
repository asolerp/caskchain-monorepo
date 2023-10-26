import React, { useState } from 'react'
import Image from 'next/image'
import Button from '@ui/common/Button'
import Spacer from '@ui/common/Spacer'
import { toast } from 'react-toastify'
import axios from 'axios'

const NewsletterSection = () => {
  const [email, setEmail] = useState('')

  const subscribe = async () => {
    try {
      await axios.post('/api/user/subscribe', {
        email,
      })
      toast.success('Subscribed successfully')
    } catch (error) {
      toast.error('Something went wrong, please try again later')
    }
  }

  return (
    <div className="grid grid-cols-2 gap-8 py-20 px-6 lg:px-0">
      <div className="flex flex-col col-span-2 lg:col-span-1 justify-center items-end">
        <Image
          src="/images/newsletter.png"
          alt=""
          width={600}
          height={500}
          className="object-cover object-center"
        />
      </div>
      <div className="flex flex-col col-span-2 lg:col-span-1 justify-center py-6 lg:w-1/2">
        <h2 className="font-rale text-black font-semibold text-4xl lg:text-6xl max-w-xs text-center lg:text-left">
          Neve Miss A Drop
        </h2>
        <Spacer size="xs" />
        <p className="font-poppins text-gray-500 font-thin text-lg text-center lg:text-left">
          Subscribe to get fresh newe updatetrending NFT
        </p>
        <Spacer size="lg" />
        <div className="flex items-center w-full rounded-full border-2 border-gray-300 pl-4 pr-2 py-2">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            className="font-poppins font-thin border-0 w-full text-xs lg:text-xl border-transparent focus:border-transparent focus:ring-0"
            placeholder="Enter your email address"
          />
          <Button onClick={subscribe} labelStyle="text-md" active>
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NewsletterSection
