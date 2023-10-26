import React from 'react'

type Props = {
  placeholder: string
  onChange: () => void
  onBlur?: () => void
  errors?: any
  mandatory?: boolean
  value: string
  list: any[]
}

// eslint-disable-next-line react/display-name
const Selector: React.FC<Props> = ({
  placeholder,
  mandatory,
  list,
  onChange,
  onBlur,
  value,
}) => {
  return (
    <div>
      <p className="font-poppins text-lg w-full mb-3">
        {mandatory && <span className="text-red-800">*</span>}
        <span className="text-gray-500">{placeholder}</span>
      </p>
      <div className="w-full bg-transparent mt-2 text-xl text-white focus:ring-0 focus:border-cask-chain rounded-lg">
        <select
          id="countries"
          className="bg-transparent border border-gray-500 text-xl rounded-lg focus:ring-cask-chain focus:border-cask-chain block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={onChange}
          onBlur={onBlur}
        >
          <option selected>
            <span className="text-xl text-gray-500">{placeholder}</span>
          </option>
          {list.map((item: any) => (
            <option
              key={item.id}
              value={item.name}
              selected={item.name === value}
            >
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default Selector
