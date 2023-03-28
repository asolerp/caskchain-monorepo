import React from 'react'

const Input = ({ ...props }) => {
  return (
    <input
      autoComplete="off"
      className="w-full bg-transparent mt-2 text-xl text-white focus:ring-0 focus:border-cask-chain rounded-lg "
      {...props}
    />
  )
}

export default Input
