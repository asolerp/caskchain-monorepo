import { normalizeString } from 'caskchain-lib'
import { useCallback, useState } from 'react'

function removeElement(array: any, element: any) {
  return array.filter((e: any) => e !== element)
}

const useMarketPlaceFilters = () => {
  const [activeSort, setActiveSort] = useState('Age')
  const [sortDirection, setSortDirection] = useState('asc' as 'asc' | 'desc')
  const [selectedFilters, setSelectedFilters] = useState<any>([])

  const mapSortDirection = {
    asc: 'Low to high',
    desc: 'High to low',
  }

  const handleAddFilter = useCallback(
    (filterType: any, value: any) => {
      const filter = selectedFilters.find((filter: any) => {
        return filter.type === filterType
      })

      if (filter) {
        if (filter.value.includes(value)) {
          return removeFilter(filterType, normalizeString(value))
        }
        return setSelectedFilters((prev: any) =>
          prev.map((filter: any) => {
            if (filter.type === filterType) {
              return {
                type: filter.type,
                value: [...filter.value, normalizeString(value)],
              }
            }
            return filter
          })
        )
      }
      setSelectedFilters((prev: any) => [
        ...prev,
        { type: filterType, value: [normalizeString(value)] },
      ])
    },
    [selectedFilters]
  )

  const removeFilter = (filterType: any, value: any, callback?: any) => {
    const filter = selectedFilters.find(
      (filter: any) =>
        filter.type.toString().toLowerCase() ===
        filterType.toString().toLowerCase()
    )

    if (filter?.value?.length <= 1) {
      setSelectedFilters((prev: any) =>
        prev.filter((filter: any) => filter.type !== filterType)
      )
    } else {
      setSelectedFilters((prev: any) =>
        prev.map((filter: any) => {
          if (filter.type === filterType) {
            return {
              type: filter.type,
              value: removeElement(filter.value, normalizeString(value)),
            }
          }
          return filter
        })
      )
    }

    if (callback) {
      callback()
    }
  }

  return {
    activeSort,
    removeFilter,
    setActiveSort,
    sortDirection,
    selectedFilters,
    handleAddFilter,
    setSortDirection,
    mapSortDirection,
    setSelectedFilters,
  }
}

export default useMarketPlaceFilters
