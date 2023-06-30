import express, { NextFunction } from 'express'
import { Request, Response } from 'express'
import { FractionalizeNftUseCase } from '../../domain/interfaces/use-cases/fractionalize-nft'
import { GetCaskInfoUseCase } from '../../domain/interfaces/use-cases/casks/get-cask-info'

import { GetNFTsUseCase } from '../../domain/interfaces/use-cases/casks/get-nfts'
import { authenticateToken } from '../middlewares/authenticateToken'

import { GetOwnedNftsUseCase } from '../../domain/interfaces/use-cases/casks/get-owned-nfts'
import { FavoriteNftUseCase } from '../../domain/interfaces/use-cases/casks/favorite-nft'
import { NftFavoriteCounterUseCase } from '../../domain/interfaces/use-cases/casks/nft-favorite-counter'
import { GetNFTFavoriteCounterUseCase } from '../../domain/interfaces/use-cases/casks/get-nft-favorites-counter'
import logger from '../utils/logger'
import { extractAddressFromToken } from '../utils/extractTokenFromRequest'
import { GetFavoriteNftsUseCase } from '../../domain/interfaces/use-cases/casks/get-favorite-nfts'
import { GetBestNftsUseCase } from '../../domain/interfaces/use-cases/casks/get-best-nfts'

export default function GetNftsRouter(
  getNfts: GetNFTsUseCase,
  getCaskInfo: GetCaskInfoUseCase,
  getFavoriteNfts: GetFavoriteNftsUseCase,
  favoriteNft: FavoriteNftUseCase,
  getNftFavoriteCounter: GetNFTFavoriteCounterUseCase,
  getBestNfts: GetBestNftsUseCase,
  nftFavoriteCounter: NftFavoriteCounterUseCase,
  getOwnedNfts: GetOwnedNftsUseCase,
  fracionalizeNft: FractionalizeNftUseCase
) {
  const router = express.Router()

  router.get('/', async (req: Request, res: Response) => {
    const {
      active = '',
      page = 1,
      pageSize = 10,
      name = '',
      filters = '',
      sortBy = '',
      sortOrder = '',
    } = req.query
    try {
      // Parse page and limit values
      const filter: any = {}
      const sort: any = {}
      const parsePage = parseInt(page.toString(), 10)
      const parsedPageSize = parseInt(pageSize.toString(), 10)

      if (active) {
        filter.active = { $eq: active === 'true' }
      }

      if (name) {
        filter.name = { $regex: name, $options: 'i' }
      }

      if (filters) {
        Object.entries(filters).forEach(
          ([key, value]: [key: string, value: any]) => {
            if (key === 'liquor') {
              filter['attributes.liquor'] = {
                $in: value.toString().replace(/\[|\]/g, '').split(','),
              }
            }
            filter[`attributes.${key}`] = {
              $in: value.toString().replace(/\[|\]/g, '').split(','),
            }
          }
        )
      }

      if (sortBy) {
        sort[sortBy.toString()] = sortOrder === 'asc' ? 1 : -1
      }

      const nfts = await getNfts.execute(
        parsePage,
        parsedPageSize,
        filter,
        sort
      )

      logger.info('Successfully fetched all NFTs', null, {
        metadata: {
          service: 'nfts-router',
        },
      })
      return res.json(nfts)
    } catch (error: any) {
      logger.error('Error fetching all NFTs: %s', error.message, {
        metadata: {
          service: 'nfts-router',
        },
      })
      return res.status(500).send({ message: 'Error fetching NFTs' })
    }
  })

  router.get('/bestBarrels', async (req: Request, res: Response) => {
    console.log('best barrels')
    try {
      const bestNfts = await getBestNfts.execute()
      logger.info('Successfully retrieve best Nfts', {
        metadata: {
          service: 'nfts-router',
        },
      })
      res.json(bestNfts)
    } catch (error: any) {
      logger.error('Error getting best Nfts', error.message, {
        metadata: {
          service: 'nfts-router',
        },
      })
      res.status(500).send({ message: 'Error getting best Nfts' })
    }
  })

  router.get(
    '/me',
    async (req: Request, res: Response, next: NextFunction) =>
      authenticateToken(req, res, next),
    async (req: Request, res: Response) => {
      const address = extractAddressFromToken(req)
      try {
        const nfts = await getOwnedNfts.execute(address)
        logger.info('Successfully fetched owned NFTs for address %s', address, {
          metadata: {
            service: 'nfts-router',
          },
        })
        return res.json(nfts)
      } catch (error: any) {
        logger.error(
          'Error fetching owned NFTs for address %s: %s',
          address,
          error.message,
          {
            metadata: {
              service: 'nfts-router',
            },
          }
        )
        return res.status(500).send({ message: 'Error fetching owned NFTs' })
      }
    }
  )

  router.get(
    '/favorites',
    async (req: Request, res: Response, next: NextFunction) =>
      authenticateToken(req, res, next),
    async (req: Request, res: Response) => {
      const address = extractAddressFromToken(req)
      try {
        const favoritesNfts = await getFavoriteNfts.execute(address)
        logger.info('Successfully fetched favorite NFTs of %s', address, {
          metadata: {
            service: 'nfts-router',
          },
        })
        return res.json(favoritesNfts)
      } catch (error: any) {
        logger.error(
          'Error fetching favorite NFTs for address %s: %s',
          address,
          error.message,
          {
            metadata: {
              service: 'nfts-router',
            },
          }
        )
        return res.status(500).send({ message: 'Error fetching favorite NFTs' })
      }
    }
  )

  router.get('/:caskId', async (req: Request, res: Response) => {
    const { caskId } = req.params
    try {
      const nfts = await getCaskInfo.execute(caskId)
      logger.info('Successfully fetched NFT info for cask ID %s', caskId, {
        metadata: {
          service: 'nfts-router',
        },
      })
      return res.json(nfts)
    } catch (error: any) {
      logger.error(
        'Error fetching NFT info for cask ID %s: %s',
        caskId,
        error.message,
        {
          metadata: {
            service: 'nfts-router',
          },
        }
      )
      return res.status(500).send({ message: 'Error fetching NFT info' })
    }
  })

  router.get('/:caskId/totalFavorites', async (req: Request, res: Response) => {
    const { caskId } = req.params
    try {
      const totalFavorites = await getNftFavoriteCounter.execute(caskId)
      logger.info(
        'Successfully fetched total favorites for NFT with cask ID %s',
        caskId,
        {
          metadata: {
            service: 'nfts-router',
          },
        }
      )
      return res.json({ totalFavorites })
    } catch (error: any) {
      logger.error(
        'Error fetching total favorites for NFT with cask ID %s: %s',
        caskId,
        error.message,
        {
          metadata: {
            service: 'nfts-router',
          },
        }
      )
      return res.status(500).send({ message: 'Error fetching total favorites' })
    }
  })

  router.post(
    '/:caskId/favorite',
    async (req: Request, res: Response, next: NextFunction) =>
      authenticateToken(req, res, next, 'user'),
    async (req: Request, res: Response) => {
      const { caskId } = req.params
      const { userId } = req.body

      if (!caskId || caskId === 'undefined' || !userId) {
        throw new Error('caskId and userId are required')
      }

      try {
        const favoriteAction = await favoriteNft.execute(userId, caskId)
        const totalFavorites = await nftFavoriteCounter.execute(
          caskId,
          favoriteAction
        )
        logger.info('Successfully favorited NFT with cask ID %s', caskId, {
          metadata: {
            service: 'nfts-router',
          },
        })
        return res.json({ totalFavorites })
      } catch (error: any) {
        logger.error(
          'Error favoriting NFT with cask ID %s: %s',
          caskId,
          error.message,
          {
            metadata: {
              service: 'nfts-router',
            },
          }
        )
        return res.status(500).send({ message: 'Error favoriting NFT' })
      }
    }
  )

  router.post('/fractionalizeToken', async (req: Request, res: Response) => {
    const { name, symbol, collection, tokenId, supply, fee, listingPrice } =
      req.body
    try {
      await fracionalizeNft.execute({
        name,
        symbol,
        collection,
        tokenId,
        supply,
        fee,
        listingPrice,
      })
      logger.info('Successfully fractionalized token with ID %s', tokenId, {
        metadata: {
          service: 'nfts-router',
        },
      })
      res.sendStatus(200)
    } catch (error: any) {
      logger.error(
        'Error fractionalizing token with ID %s: %s',
        tokenId,
        error.message,
        {
          metadata: {
            service: 'nfts-router',
          },
        }
      )
      res.status(500).send({ message: 'Error fractionalizing token' })
    }
  })

  return router
}
