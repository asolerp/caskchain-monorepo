import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import Image from 'next/image'
import Spacer from '@ui/common/Spacer'
import { upperCaseFirstLetter } from 'caskchain-lib'

type FilterMarketplaceProps = {
  filter: string
  label: string
  size: string
  items: any[]
  sufix?: string
  onClick: () => void
  onClickItem: (item: any) => void
}

const FilterMarketplace: React.FC<FilterMarketplaceProps> = ({
  filter,
  label,
  size,
  sufix,
  items = [],
  onClick,
  onClickItem,
}) => {
  const iconSize: any = {
    md: 25,
    sm: 10,
    xs: 5,
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div className="flex flex-col items-center">
        <Menu.Button>
          <div
            onClick={onClick}
            className="group w-fit h-10 py-3 px-3 rounded-full flex flex-row items-center space-x-3 border border-cask-chain cursor-pointer"
          >
            <Image
              src={`/icons/filters/${filter}.svg`}
              width={iconSize[size]}
              height={iconSize[size]}
              alt="filter"
              className="w-6 h-6"
            />
            <p className="font-poppins text-gray-200 group-hover:text-cask-chain">
              {label}
            </p>
            <Image
              src="/icons/search.svg"
              width={20}
              height={20}
              alt="filter"
              className="w-5 h-5"
            />
          </div>
        </Menu.Button>
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
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-500 rounded-md bg-[#292929] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-gray-400">
          <div className="px-4 py-4 ">
            <input
              placeholder="Search"
              className="w-full bg-[#292929] p-2 border rounded-xl text-gray-200"
            ></input>
            <Spacer size="sm" />
            {/* <p className="text-white">Buscar</p> */}
            {items.length > 0 ? (
              <>
                {items.map((item: any, i: number) => (
                  <Menu.Item key={i}>
                    {({ active }) => (
                      <button
                        onClick={() => onClickItem(item)}
                        className={`${
                          active
                            ? 'bg-cask-chain text-gray-900'
                            : 'text-gray-300'
                        } group flex w-full items-center rounded-md px-2 py-2 text-md font-poppins font-medium`}
                      >
                        {upperCaseFirstLetter(item)} {sufix}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </>
            ) : (
              <p className="font-poppins text-gray-400 text-center">
                We could find any type of the selected filter
              </p>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default FilterMarketplace
