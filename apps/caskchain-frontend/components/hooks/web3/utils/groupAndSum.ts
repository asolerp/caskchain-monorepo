function groupByAndSum(arr: any) {
  return arr.reduce((sum: any, obj: any) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (sum[key.split('_').join(' ')]) {
        sum[key.split('_').join(' ')] += value
      } else {
        sum[key.split('_').join(' ')] = value
      }
    })
    return sum
  }, {})
}

export default groupByAndSum
