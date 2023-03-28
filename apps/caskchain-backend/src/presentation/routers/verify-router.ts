import * as dotenv from 'dotenv'

import { v4 as uuidv4 } from 'uuid'
import express from 'express'
import { Request, Response } from 'express'
import {
  contractAddress,
  pinataApiKey,
  pinataSecretApiKey,
} from '../../data/data-sources/blockchain/utils'
import { NftMeta } from '../../types/nft'
import axios from 'axios'
import { authenticateToken } from '../middlewares/authenticateToken'
import jwt_decode from 'jwt-decode'

export default function VerifyRouter() {
  const router = express.Router()

  router.get('/', async (req: Request, res: Response) => {
    try {
      const message = { contractAddress, id: uuidv4() }

      req.session.messageSession = message
      req.session.save()

      return res.json(message)
    } catch {
      return res.status(422).send({ message: 'Cannot generate a message!' })
    }
  })

  router.post('/', authenticateToken, async (req: Request, res: Response) => {
    try {
      console.log(process.env.PUBLIC_KEY)
      const { body } = req
      const nft = body.nft as NftMeta

      if (!nft.name || !nft.description || !nft.attributes) {
        return res
          .status(422)
          .send({ message: 'Some of the form data are missing' })
      }

      const authHeader = req.headers['authorization']
      const token = authHeader && authHeader.split(' ')[1]
      const { address } = jwt_decode(token as string) as any

      if (address !== process.env.PUBLIC_KEY) {
        return res.status(403).send({ message: 'Only admins can mint NFTs' })
      }

      const jsonRes = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        {
          pinataMetadata: {
            name: uuidv4(),
          },
          pinataContent: nft,
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
      return res.status(422).send({ message: 'Cannot create JSON' })
    }
  })
  return router
}
