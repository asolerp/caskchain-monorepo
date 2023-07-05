import { createMagic } from 'caskchain-lib/lib/magic'

const config = {
  network: {
    rpcUrl: process.env.NEXT_PUBLIC_BLOCKCHAIN_URL,
    chainId: process.env.NEXT_PUBLIC_NETWORK_ID,
  },
}

// Pass in your publishable key from your .env file
export const magic = createMagic(
  process.env.NETX_PUBLIC_MAGIC_PUBLISHABLE_KEY as string,
  config
)
