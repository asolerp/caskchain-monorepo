const parseStatusColors = (status: string) => {
  switch (status) {
    case 'live':
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
      }
    case 'canceled':
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
      }
    case 'accepted':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
      }
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
      }
  }
}

export default parseStatusColors
