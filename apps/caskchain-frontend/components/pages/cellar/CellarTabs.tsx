import { useState } from 'react'
import { motion } from 'framer-motion'
import CasksTab from './CasksTab'
import { Spacer } from 'caskchain-ui'

import { useRouter } from 'next/router'

const tabs = [
  { id: 'my-casks', label: 'My casks' },
  // { id: 'favourites', label: 'Favourites' },
  // { id: 'my-offers-sent', label: 'Offers sent' },
  // { id: 'my-offers-received', label: 'Offers received' },
  // { id: 'my-activity', label: 'My activity' },
]

const CellarTabs = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(router.query.tab)

  const _selectedTab = (router.query.tab as string) ?? 'my-casks'

  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex w-full justify-center border-b border-b-gray-500">
        <div className="flex flex-row w-2/4 justify-between">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                router.replace(`/cellar/${tab.id}`, undefined, {
                  shallow: true,
                })
              }}
              className={`${
                activeTab === tab.id ? 'text-white' : 'hover:text-white/60'
              } relative px-3 py-1.5 text-xl font-poppins text-gray-500 outline-sky-400 transition focus-visible:outline-2`}
              style={{
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {activeTab === tab.id && (
                <motion.span
                  layoutId="bubble"
                  className="absolute inset-0 z-10 border-b-2 border-b-cask-chain mix-blend-difference"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <Spacer size="lg" />
      <div className="w-full">
        {_selectedTab === 'my-casks' && <CasksTab />}
      </div>
      <div className="w-full">
        {/* {_selectedTab === 'favourites' && <FavouritesTab />}
        {_selectedTab === 'my-offers-sent' && <MyOffersSent />}
        {_selectedTab === 'my-offers-received' && <MyOffersReceived />} */}
      </div>
    </div>
  )
}
export default CellarTabs
