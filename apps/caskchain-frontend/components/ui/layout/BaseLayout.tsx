import { ReactNode } from 'react'
import Navbar from '../navbar'
import FooterSection from 'components/pages/home/FooterSection'
import LoadingOverlay from 'components/pages/Loading'

import MainAnimationSection from 'components/pages/home/MainAnimationSection'

interface Props {
  background?: string
  bottomBanner?: ReactNode
  children: ReactNode
}

const BaseLayout: React.FC<Props> = ({
  background,
  bottomBanner,
  children,
}) => {
  const backgroundClass = background ? background : ''

  const hasBottomBanner = bottomBanner ? true : false

  return (
    <>
      <MainAnimationSection />
      <Navbar />
      <LoadingOverlay />
      <>
        <div className={`overflow-hidden min-h-screen ${backgroundClass}`}>
          <div className=" bg-opacity-80 w-screen  ">
            <div className="flex flex-col justify-center items-center w-full h-full">
              {children}
            </div>
            {!hasBottomBanner && <FooterSection />}
          </div>
        </div>
        {hasBottomBanner && (
          <>
            {bottomBanner}
            <FooterSection />
          </>
        )}
      </>
    </>
  )
}

export default BaseLayout
