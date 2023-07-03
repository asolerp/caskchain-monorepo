import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import Image from 'next/image'

function Dropdown({
  label,
  items,
  active,
  onClick,
}: {
  label: string
  items: any
  active: string
  onClick: any
}) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div className="flex flex-col items-center">
        <Menu.Button>
          <p className="flex flex-row items-center font-poppins text-white text-lg">
            {label}{' '}
            <span>
              <Image
                src="/icons/sort.png"
                width={15}
                height={15}
                alt="sort"
                className="ml-2 cursor-pointer w-auto h-auto"
              />
            </span>
          </p>
        </Menu.Button>
        <p className="text-cask-chain font-poppins">{active}</p>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-500 rounded-md bg-[#292929] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="px-1 py-1 ">
            {items.map((item: any, i: number) => (
              <Menu.Item key={i}>
                {({ active }) => (
                  <button
                    onClick={() => onClick(item)}
                    className={`${
                      active ? 'bg-cask-chain text-gray-900' : 'text-gray-300'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    {item.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default Dropdown
