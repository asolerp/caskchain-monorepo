require('dotenv-mono').load({ path: '../../.env' })

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
    domains: [
      'i.imgur.com',
      'res.cloudinary.com',
      'gateway.pinata.cloud',
      'gold-tropical-mongoose-649.mypinata.cloud',
      'images.unsplash.com',
    ],
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
    ['NEXT_PUBLIC_PINATA_DOMAIN']: process.env.PINATA_DOMAIN,
    ['NEXT_PUBLIC_PINATA_GATEWAY_TOKEN']: process.env.PINATA_GATEWAY_TOKEN,
    ['NEXT_PUBLIC_PINATA_PUBLIC_URL']: process.env.PINATA_PUBLIC_URL,
    ['NEXT_PUBLIC_PINATA_GATEWAY_URL']: process.env.PINATA_GATEWAY_URL,
    ['NEXT_PUBILC_USDT_CONTRACT_ADDRESS']: process.env.USDT_CONTRACT_ADDRESS,
    ['NETX_PUBLIC_MAGIC_PUBLISHABLE_KEY']: process.env.MAGIC_PUBLISHABLE_KEY,
    ['NEXT_PUBLIC_BLOCKCHAIN_URL']: process.env.BLOCKCHAIN_URL,
    ['NEXT_PUBLIC_TOKEN_NAME']: process.env.TOKEN_NAME,
    ['NEXT_PUBLIC_MAILCHIMP_API_KEY']: process.env.MAILCHIMP_API_KEY,
    ['NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID']: process.env.MAILCHIMP_AUDIENCE_ID,
  },
})

module.exports = nextConfig
