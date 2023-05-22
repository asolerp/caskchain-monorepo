import { ReactNode } from 'react'
import Navbar from '../navbar'
import FooterSection from 'components/pages/home/FooterSection'
import LoadingOverlay from 'components/pages/Loading'
import useLocalLoading from '@hooks/common/useLocalLoading'
import { AnimatePresence } from 'framer-motion'
import MainAnimationSection from 'components/pages/home/MainAnimationSection'

interface Props {
  background?: string
  children: ReactNode
}

const BaseLayout: React.FC<Props> = ({ background, children }) => {
  const backgroundClass = background ? background : ''

  return (
    <AnimatePresence>
      <MainAnimationSection />
      <Navbar />
      <LoadingOverlay />
      <div className={`overflow-hidden min-h-screen ${backgroundClass}`}>
        <div className=" bg-opacity-80 backdrop-blur-xl w-screen  ">
          <div className="flex flex-col justify-center items-center w-full h-full">
            {children}
          </div>
          <FooterSection />
        </div>
      </div>
    </AnimatePresence>
  )
}

export default BaseLayout
