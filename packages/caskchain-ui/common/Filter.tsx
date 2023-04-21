import React from 'react'

type Props = {
  active: boolean
  name: string
  onPress: () => void
}

const Filter: React.FC<Props> = ({ active = false, name, onPress }) => {
  const defaultClass =
    'rounded-3xl py-3 px-4 hover:text-black hover:bg-cask-chain cursor-pointer'
  const activeClass = 'bg-cask-chain text-black ' + defaultClass
  const inactiveClass =
    'border-2 border-cask-chain py-3 px-4 text-white ' + defaultClass

  return (
    <div
      className={`${
        active ? activeClass : inactiveClass
      } flex items-center justify-center`}
      onClick={onPress}
    >
      <span className="font-bold text-xs">{name}</span>
    </div>
  )
}

export default Filter
