import express from 'express'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { addressCheckMiddleware } from '../middlewares/addressCheckMiddleware'

export default function SignatureRouter() {
  const router = express.Router()

  router.post(
    '/',
    addressCheckMiddleware,
    async (req: Request, res: Response) => {
      const { address } = req.body
      const token = jwt.sign(
        { address: address },
        process.env.TOKEN_SECRET as string,
        {
          expiresIn: '2 days',
        }
      )
      console.log(token)
      return res.json(token)
    }
  )

  return router
}
