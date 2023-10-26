import { useState } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { Spacer } from 'caskchain-ui'
import axios from 'axios'
import { toast } from 'react-toastify'

const SubscriptionForm: React.FC = () => {
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
    <div>
      <h4 className="font-poppins text-white font-medium text-xl">
        Stay up to date
      </h4>
      <Spacer size="sm" />
      <div className="flex flex-row w-full lg:w-fit space-x-4 items-center px-4 py-3 bg-gray-500 rounded-3xl">
        <input
          onChange={(e) => setEmail(e.target.value)}
          className="bg-transparent w-full lg:w-fit placeholder-gray-300 font-poppins text-sm font-thin  text-gray-300"
          placeholder="Your email address"
        ></input>
        <PaperAirplaneIcon
          onClick={subscribe}
          className="w-4 h-4 -rotate-45 text-gray-300"
        />
      </div>
    </div>
  )
}

export default SubscriptionForm
