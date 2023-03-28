require('dotenv-mono').load(
  process.env.NODE_ENV === 'development'
    ? { path: '../../.env' }
    : { path: '.env' }
)

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  env: {
    ['NEXT_PUBLIC_NETWORK_ID']: process.env.NETWORK_ID,
  },
}

module.exports = nextConfig
