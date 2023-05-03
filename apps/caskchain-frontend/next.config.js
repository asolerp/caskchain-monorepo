// const path = require('path')
require('dotenv-mono').load(
  process.env.NODE_ENV === 'development'
    ? { path: '../../.env' }
    : { path: '.env' }
)

const API_URL = 'https://caskchain-backend.herokuapp.com/'

const withTM = require('next-transpile-modules')([
  'caskchain-ui',
  'caskchain-lib',
])

const nextConfig = withTM({
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    )

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      }
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
  async redirects() {
    return [
      {
        source: '/marketplace',
        destination: '/marketplace/search',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_URL}/api/:path*`, // Proxy to Backend
      },
    ]
  },
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'gateway.pinata.cloud', 'i.imgur.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `https://caskchain-backend.herokuapp.com/api/:path*`, // Proxy to Backend
      },
    ]
  },
  transpilePackages: ['caskchain-lib'],
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  env: {
    ['NEXT_PUBLIC_NETWORK_ID']: process.env.NETWORK_ID,
    ['NEXT_PUBLIC_API_URL']: process.env.API_URL,
  },
})

module.exports = nextConfig
