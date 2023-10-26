import { v4 as uuidv4 } from 'uuid'
import express, { NextFunction } from 'express'
import { Request, Response } from 'express'
import { FileReq, NftMeta } from '../../types/nft'
import axios from 'axios'

import FormData from 'form-data'
import logger from '../utils/logger'

const JWT = `Bearer ${process.env.PINATA_API_KEY}`

export default function PinNftRouter() {
  const router = express.Router()

  router.post(
    '/pin-image',
    // async (req: Request, res: Response, next: NextFunction) =>
    //   authenticateToken(req, res, next, 'admin'),
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

        return res.status(200).send(fileRes.data)
      } catch (e: any) {
        logger.error('Error pining image to IPFS', e.message, {
          metadata: {
            service: 'nfts-router',
          },
        })
        return res.status(422).send({ message: 'Cannot pin image' })
      }
    }
  )

  router.post(
    '/pin-metadata',
    // async (req: Request, res: Response, next: NextFunction) =>
    //   authenticateToken(req, res, next, 'admin'),
    async (req: Request, res: Response) => {
      try {
        const { body } = req
        const nft = body.nft as NftMeta

        if (!nft.name || !nft.description || !nft.attributes) {
          return res
            .status(422)
            .send({ message: 'Some of the form data are missing' })
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
              Authorization: JWT,
            },
          }
        )

        return res.status(200).send(jsonRes.data)
      } catch (e: any) {
        logger.error('Error pining metadata to IPFS', e.message, {
          metadata: {
            service: 'nfts-router',
          },
        })
        return res.status(422).send({ message: 'Cannot create JSON' })
      }
    }
  )
  return router
}
