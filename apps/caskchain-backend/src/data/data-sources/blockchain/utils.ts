import * as dotenv from 'dotenv'
dotenv.config({ path: `../../.env` })

export const contractAddress = process.env.NFT_CONTRACT_ADDRESS as string
export const nftVendorAddress = process.env.NFT_VENDOR_ADDRESS as string
export const nftOffersAddress = process.env.NFT_OFFERS_ADDRESS as string

export const pinataApiKey = process.env.PINATA_API_KEY as string
export const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY as string
