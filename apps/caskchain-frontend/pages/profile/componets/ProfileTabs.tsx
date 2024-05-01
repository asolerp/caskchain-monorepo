import { useState } from 'react'
import { motion } from 'framer-motion'
import SettingsTab from './SettingsTab'
import { Spacer } from 'caskchain-ui'
import ProfileTab from './ProfileTab'
import ShippingTab from './ShippingTab'
import BackupTab from './BackupTab'

const tabs = [
  { id: 'settings', label: 'Settings' },
  { id: 'profile', label: 'Profile' },
  // { id: 'shipping', label: 'Shipping Address' },
  // { id: 'backup', label: 'Backup Contact' },
]

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id)

  return (
    <div className="flex flex-col w-2/4 items-center">
      <div className="flex w-[250px] justify-between border-b border-b-gray-500">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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
      <Spacer size="lg" />
      <Spacer size="xl" />
      <div className="w-full">
        {activeTab === 'settings' && <SettingsTab />}
        {activeTab === 'profile' && <ProfileTab />}
        {/* {activeTab === 'shipping' && <ShippingTab />}
        {activeTab === 'backup' && <BackupTab />} */}
      </div>
    </div>
  )
}
export default ProfileTabs
