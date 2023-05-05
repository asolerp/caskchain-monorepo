import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

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
        console.log('ROLE', role, req.query.role, decodedToken?.role)
        if (decodedToken?.role === 'admin') {
          return next()
        }
        if (decodedToken?.role !== (role || req.query.role)) {
          console.log("ROLE DON'T MATCH")
          return res.sendStatus(401)
        }
      }

      next()
    }
  )
}
