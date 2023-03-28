import { v4 as uuidv4 } from 'uuid'
import express from 'express'
import { Request, Response } from 'express'
import {
  pinataApiKey,
  pinataSecretApiKey,
} from '../../data/data-sources/blockchain/utils'

import { addressCheckMiddleware } from '../middlewares/addressCheckMiddleware'
import axios from 'axios'

export default function OrderBottleRouter() {
  const router = express.Router()

  router.post(
    '/',
    addressCheckMiddleware,
    async (req: Request, res: Response) => {
      try {
        const { extractions, tokenURI } = req.body

        if (!extractions || !tokenURI) {
          return res
            .status(422)
            .send({ message: 'Order bottle data are missing' })
        }

        const metaResponse = await axios.get(tokenURI)
        const meta = await metaResponse.data

        const attributes = meta.attributes
        attributes[1].value = String(Number(attributes[1].value) + extractions)

        const jsonRes = await axios.post(
          'https://api.pinata.cloud/pinning/pinJSONToIPFS',
          {
            pinataMetadata: {
              name: uuidv4(),
            },
            pinataContent: { ...meta, attributes },
          },
          {
            headers: {
              pinata_api_key: pinataApiKey,
              pinata_secret_api_key: pinataSecretApiKey,
            },
          }
        )

        return res.status(200).send(jsonRes.data)
      } catch (e: any) {
        console.error(e.message)
      }
    }
  )
  return router
}
