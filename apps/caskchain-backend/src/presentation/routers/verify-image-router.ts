import { v4 as uuidv4 } from 'uuid'
import express from 'express'
import { Request, Response } from 'express'
import {
  pinataApiKey,
  pinataSecretApiKey,
} from '../../data/data-sources/blockchain/utils'
import { FileReq } from '../../types/nft'
import FormData from 'form-data'
import jwt_decode from 'jwt-decode'

import axios from 'axios'
import { authenticateToken } from '../middlewares/authenticateToken'

export default function VerifyImageRouter() {
  const router = express.Router()

  router.post('/', authenticateToken, async (req: Request, res: Response) => {
    try {
      const { bytes, fileName, contentType } = req.body as FileReq

      if (!bytes || !fileName || !contentType) {
        return res.status(422).send({ message: 'Image data are missing' })
      }

      const authHeader = req.headers['authorization']
      const token = authHeader && authHeader.split(' ')[1]
      const { address } = jwt_decode(token as string) as any

      if (address !== process.env.PUBLIC_KEY) {
        return res.status(403).send({ message: 'Only admins can mint NFTs' })
      }

      const buffer = Buffer.from(Object.values(bytes))
      const formData = new FormData()

      formData.append('file', buffer, {
        contentType,
        filename: fileName + '-' + uuidv4(),
      })

      const fileRes = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          maxBodyLength: Infinity,
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
          },
        }
      )

      return res.status(200).send(fileRes.data)
    } catch (e: any) {
      console.error(e.message)
    }
  })
  return router
}
