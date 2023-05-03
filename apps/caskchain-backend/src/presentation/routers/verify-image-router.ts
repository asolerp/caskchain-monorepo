import { v4 as uuidv4 } from 'uuid'
import express, { NextFunction } from 'express'
import { Request, Response } from 'express'
import {
  pinataApiKey,
  pinataSecretApiKey,
} from '../../data/data-sources/blockchain/utils'
import { FileReq } from '../../types/nft'
import FormData from 'form-data'

import axios from 'axios'
import { authenticateToken } from '../middlewares/authenticateToken'

const JWT =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0NzVlY2Y4YS0wNjg4LTQ1ZGEtOTNjOC0zZTg5OWI2YjI5OWUiLCJlbWFpbCI6ImFsYmVydG9zb2xwYWxAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImQ3ZjY2N2Y3Y2E5ODE2MTQ0NGU3Iiwic2NvcGVkS2V5U2VjcmV0IjoiMGEwODZlN2Q1M2Y5Mzg0OGMzYWE2ZmQ1NjdjYWQ1ODVhMTc5N2RiOTQyMzIzYjY5MWUxYmZkYTZkOGZkN2EwYyIsImlhdCI6MTY4MzA0MzA2N30.FRVGEXLiZCEs6G9hr39O9EzTgu1Zv-DYZ_y0K12iFLE'

export default function VerifyImageRouter() {
  const router = express.Router()

  router.post(
    '/',
    async (req: Request, res: Response, next: NextFunction) =>
      authenticateToken(req, res, next, 'admin'),
    async (req: Request, res: Response) => {
      try {
        const { bytes, fileName, contentType } = req.body as FileReq

        if (!bytes || !fileName || !contentType) {
          return res.status(422).send({ message: 'Image data are missing' })
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
              Authorization: JWT,
            },
          }
        )

        console.log('DATA', fileRes.data)

        return res.status(200).send(fileRes.data)
      } catch (e: any) {
        console.error(e.message)
      }
    }
  )
  return router
}
