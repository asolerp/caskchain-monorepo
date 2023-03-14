require('dotenv-mono').load({ path: '../../.env' })

const nextConfig = {
  env: {
    ['NEXT_PUBLIC_NETWORK_ID']: process.env.NETWORK_ID,
  },
}

module.exports = nextConfig
