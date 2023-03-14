import { Request } from 'express'
import jwt_decode from 'jwt-decode'

export const extractAddressFromToken = (req: Request): string => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  const { address } = jwt_decode(token as string) as any
  return address
}
