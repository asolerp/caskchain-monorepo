export const addressSimplifier = (address: string) => {
  return `0x${address[2]}${address[3]}${address[4]}....${address.slice(-4)}`
}
