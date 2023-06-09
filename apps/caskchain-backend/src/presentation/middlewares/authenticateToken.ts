import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import logger from '../utils/logger'

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
  role?: 'user' | 'admin'
) => {
  const authHeader = req.headers['authorization']

  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) {
    return res.sendStatus(401)
  }

  jwt.verify(
    token,
    process.env.TOKEN_SECRET as string,
    (err, decodedToken: any) => {
      if (err) return res.sendStatus(403)
      if (role || req.query.role) {
        if (decodedToken?.role === 'admin') {
          return next()
        }
        if (decodedToken?.role !== (role || req.query.role)) {
          logger.error('Unauthorized', {
            metadata: {
              service: 'auth',
            },
          })
          return res.sendStatus(401)
        }
      }

      next()
    }
  )
}
