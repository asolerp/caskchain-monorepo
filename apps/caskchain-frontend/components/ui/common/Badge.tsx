import React from 'react'

type BadgeProps = {
  bgColor?: string
  textColor?: string
  children: React.ReactNode
}

const Badge: React.FC<BadgeProps> = ({
  bgColor = 'bg-transparent',
  textColor = 'text-black',
  children,
}) => {
  return (
    <div className={`px-6 py-2 w-fit rounded-3xl ${bgColor}`}>
      <p
        className={`font-poppins font-semibold text-md text-center ${textColor}`}
      >
        {children}
      </p>
    </div>
  )
}

export default Badge
