function groupByAndSum(arr: any) {
  return arr.reduce((sum: any, obj: any) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (sum[key]) {
        sum[key] += value
      } else {
        sum[key] = value
      }
    })
    return sum
  }, {})
}

export default groupByAndSum
