import { ReactNode } from 'react'

import LeftSidebar from '@ui/navbar/LeftSidebar'
import RightSidebar from '@ui/navbar/RightSidebar'

interface Props {
  background?: string
  children: ReactNode
}

const BaseLayout: React.FC<Props> = ({ background, children }) => {
  const backgroundClass = background ? background : ''

  return (
    <>
      <div className={`min-h-screen ${backgroundClass}`}>
        <div className="flex flex-row mx-auto min-h-screen">
          <LeftSidebar />
          <div className="flex flex-col justify-center items-center w-full h-full">
            {children}
          </div>
          <RightSidebar />
        </div>
      </div>
    </>
  )
}

export default BaseLayout
