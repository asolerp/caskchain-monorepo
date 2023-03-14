import React from 'react'

type SliderProps = {
  label?: string
  value: number
  minValue?: number
  setValue: (value: number) => void
}

const Slider: React.FC<SliderProps> = ({
  label,
  value,
  minValue,
  setValue,
}) => {
  return (
    <>
      {label && (
        <>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Default range
          </label>
        </>
      )}

      <input
        id="default-range"
        type="range"
        value={value}
        onChange={(e) => {
          if (minValue !== undefined) {
            if (Math.round(parseInt(e.target.value) / 10) >= minValue) {
              setValue(parseInt(e.target.value))
            }
          }
        }}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      ></input>
    </>
  )
}

export default Slider
