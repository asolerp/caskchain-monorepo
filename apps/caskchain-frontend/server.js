const express = require('express')
const next = require('next')
const { createProxyMiddleware } = require('http-proxy-middleware')

const port = 3001
const dev = process.env.APP_ENV !== 'ganache'
const app = next({ dev })
const handle = app.getRequestHandler()

const apiPaths = {
  '/api': {
    target: 'http://localhost:4000',
    pathRewrite: {
      '^/api': '/api',
    },
    changeOrigin: true,
  },
}

const isDevelopment = process.env.APP_ENV !== 'ganache'

app
  .prepare()
  .then(() => {
    const server = express()

    if (isDevelopment) {
      server.use('/api', createProxyMiddleware(apiPaths['/api']))
    }

    server.all('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
  .catch((err) => {
    console.log('Error:::::', err)
  })
