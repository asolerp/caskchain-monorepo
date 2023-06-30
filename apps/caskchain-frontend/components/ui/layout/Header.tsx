import React from 'react'

type HeaderProps = {
  title?: string
  children?: React.ReactNode
  background?: string
}

const Header: React.FC<HeaderProps> = ({
  title,
  children,
  background = 'default',
}) => {
  const mapBackground: any = {
    default: 'bg-header_1',
    rum: 'bg-ron',
    whiskey: 'bg-whiskey',
    tequila: 'bg-tequila',
    brandy: 'bg-brandy',
  }

  const height = children || title ? 'h-[250px]' : 'h-[120px]'

  return (
    <div
      className={`${
        background ? mapBackground[background] : background
      } w-screen ${height} bg-[length:w_screen_300px] bg-center flex items-end justify-center`}
    >
      {children ? (
        children
      ) : (
        <h1 className="font-rale font-semibold text-6xl text-cask-chain mb-10">
          {title}
        </h1>
      )}
    </div>
  )
}

export default Header
