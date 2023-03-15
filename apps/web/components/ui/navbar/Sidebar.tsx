import React from 'react'

const Sidebar = ({ open }) => {
  const openClass = open ? 'translate-x-0' : 'translate-x-full'

  return (
    <div
      className={`absolute right-0 h-screen w-[500px] shadow-2xl border-l border-gray-700 bg-black-light transition-transform ease-in-out duration-500 ${openClass}`}
    ></div>
  )
}

export default Sidebar
