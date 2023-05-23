import React from 'react'
import Spinner from './Spinner'

type ButtonProps = {
  fit?: boolean
  width?: string
  active?: boolean
  loading?: boolean
  disabled?: boolean
  labelStyle?: string
  containerStyle?: string
  onClick?: () => void
  children: string
}

const Button: React.FC<ButtonProps> = ({
  width,
  onClick,
  loading,
  children,
  labelStyle,
  fit = true,
  active = true,
  containerStyle,
  disabled = false,
}) => {
  const activeClass = active
    ? 'bg-cask-chain'
    : 'ring-1 ring-cask-chain text-cask-chain'
  const containerClass = containerStyle || 'px-6 py-3'
  const labelClass = labelStyle || 'font-poppins text-lg text-center'
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : ''
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        onClick && onClick()
      }}
      className={`${
        width ? width : fit ? 'w-fit' : 'w-full'
      } cursor-pointer rounded-xl hover:bg-opacity-80 ${activeClass} ${containerClass} ${disabledClass}`}
    >
      {loading ? (
        <Spinner color="black" />
      ) : (
        <p className={`font-semibold ${labelClass}`}>{children}</p>
      )}
    </div>
  )
}

export default Button
