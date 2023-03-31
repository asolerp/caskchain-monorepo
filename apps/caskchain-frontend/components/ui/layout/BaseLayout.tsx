import { ReactNode } from 'react'
import Navbar from '../navbar'

interface Props {
  background?: string
  children: ReactNode
}

const BaseLayout: React.FC<Props> = ({ background, children }) => {
  const backgroundClass = background ? background : ''

  return (
    <>
      <div className={`overflow-hidden min-h-screen ${backgroundClass}`}>
        <div className=" bg-opacity-80 mx-auto backdrop-blur-xl	">
          <Navbar />
          <div className="flex flex-col justify-center items-center w-full h-full">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default BaseLayout
