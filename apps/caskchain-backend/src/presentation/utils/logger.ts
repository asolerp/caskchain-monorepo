import winston from 'winston'
import { Loggly } from 'winston-loggly-bulk'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'caskchain-api' },
  transports: [
    new Loggly({
      token: '1cc48c7f-ce5d-40fe-a35b-d68b5c37a013',
      subdomain: 'caskchain',
      tags: ['Winston-NodeJS'],
      json: true,
    }),
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...metadata }) => {
          let msg = `[${timestamp}] [${level}] ${message}`
          if (Object.keys(metadata).length) {
            msg += ` ${JSON.stringify(metadata)}`
          }
          return msg
        })
      ),
    }),
  ],
})

export default logger
