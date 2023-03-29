require('dotenv-mono').load(
  process.env.NODE_ENV === 'development'
    ? { path: '../../.env' }
    : { path: '.env' }
)

const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:4000'
    : 'https://caskchain-backend.herokuapp.com/'

console.log('API_URL', API_URL)

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_URL}/api/:path*`, // Proxy to Backend
      },
    ]
  },
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  env: {
    ['NEXT_PUBLIC_NETWORK_ID']: process.env.NETWORK_ID,
    ['NEXT_PUBLIC_API_URL']: process.env.API_URL,
  },
}

module.exports = nextConfig
