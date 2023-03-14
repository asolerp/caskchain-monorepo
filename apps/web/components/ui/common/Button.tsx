import React from 'react'
import Spinner from './Spinner'

type ButtonProps = {
  active?: boolean
  loading?: boolean
  labelStyle?: string
  containerStyle?: string
  onClick?: () => void
  children: string
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  loading,
  children,
  labelStyle,
  active = true,
  containerStyle,
}) => {
  const activeClass = active
    ? 'bg-cask-chain'
    : 'ring-1 ring-cask-chain text-cask-chain'
  const containerClass = containerStyle || 'px-6 py-3'
  const labelClass = labelStyle || 'font-poppins text-lg'
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-full hover:bg-opacity-80 ${activeClass} ${containerClass}`}
    >
      {loading ? (
        <Spinner color="black" />
      ) : (
        <p className={`${labelClass}`}>{children}</p>
      )}
    </div>
  )
}

export default Button
