import React from 'react'

type HeaderProps = {
  title?: string
  children?: React.ReactNode
}

const Header: React.FC<HeaderProps> = ({ title, children }) => {
  return (
    <div className="bg-header_1 w-screen h-[300px] bg-cover flex items-end justify-center">
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
