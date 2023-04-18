import { NextFunction, Request, Response } from 'express'
import logger from '../utils/logger'
function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log('Middleware Error Hadnling')
  const errStatus = err.statusCode || 500
  const errMsg = err.message || 'Something went wrong'
  logger.error(
    `${err.name} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  )
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {},
  })
}
export default errorHandler
