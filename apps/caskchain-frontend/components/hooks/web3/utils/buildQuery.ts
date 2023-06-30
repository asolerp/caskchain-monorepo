const buildQueryString = (
  page: number,
  pageSize: number,
  name?: string,
  filters?: any,
  activeSort?: string,
  sortDirection?: string
): string => {
  let queryString = `/api/casks?page=${page}&pageSize=${pageSize}&active=true`

  if (name) {
    queryString += `&name=${name}`
  }

  if (filters) {
    filters.map((filter: any) => {
      queryString += `&filters[${filter.type}]=[${filter.value}]`
    })
  }

  if (activeSort) {
    queryString += `&sortBy=${activeSort.toLowerCase()}`
  }

  if (sortDirection) {
    queryString += `&sortOrder=${sortDirection}`
  }

  return queryString
}

export default buildQueryString
