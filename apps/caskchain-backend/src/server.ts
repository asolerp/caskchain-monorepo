import * as dotenv from 'dotenv'
dotenv.config(
  process.env.NODE_ENV === 'development'
    ? { path: '../../.env' }
    : { path: '.env' }
)

import express from 'express'
import cors from 'cors'
import session from 'express-session'
import errorHandler from './presentation/middlewares/errorHandler'

const server = express()

server.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:3001'],
  })
)

server.use(
  session({
    secret: 'thisismysecrctekeyfhrgfgrfrty84fwir767',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
      sameSite: 'lax',
      secure: false,
    },
  })
)

// server.use(express.raw({type: "*/*"}))
server.use(express.json({ limit: '25mb' }))
server.use((req, res, next) => {
  if (req.originalUrl.startsWith('/webhook')) {
    next()
  } else {
    express.json()(req, res, next)
  }
})
server.use(express.urlencoded({ extended: true, limit: '25mb' }))

server.use(errorHandler)

export default server
