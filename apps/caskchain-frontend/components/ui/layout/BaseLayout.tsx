import { ReactNode } from 'react'
import Navbar from '../navbar'
import FooterSection from 'components/pages/home/FooterSection'
import { useGlobal } from '@providers/global'
import { LoadingAnimation } from '@ui/common/Loading/LoadingAnimation'

interface Props {
  background?: string
  children: ReactNode
}

const BaseLayout: React.FC<Props> = ({ background, children }) => {
  const backgroundClass = background ? background : ''
  const {
    state: { loading },
  } = useGlobal()
  return (
    <>
      {loading && <LoadingAnimation />}
      <div className={`overflow-hidden min-h-screen ${backgroundClass}`}>
        <div className=" bg-opacity-80 backdrop-blur-xl w-screen  ">
          <Navbar />
          <div className="flex flex-col justify-center items-center w-full h-full">
            {children}
          </div>
          <FooterSection />
        </div>
      </div>
    </>
  )
}

export default BaseLayout
