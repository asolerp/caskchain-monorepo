import axios from 'axios'
import { BASE_URL } from '../utils'

export const pinImageAndMetadata = async (
  file: any,
  nftMeta: any
): Promise<void> => {
  if (!file && !nftMeta) {
    throw new Error('File and metadata are required')
  }

  const buffer = await file!.arrayBuffer()
  const bytes = new Uint8Array(buffer)

  const imageResponse = await axios.post(`${BASE_URL}/pinImage`, {
    bytes,
    contentType: file!.type,
    fileName: file!.name.replace(/\.[^/.]+$/, ''),
  })

  const imageData = imageResponse.data

  const metadataResponse = await axios.post(`${BASE_URL}/pinMetadata`, {
    nft: {
      ...nftMeta,
      attributes: nftMeta.attributes.map((attr: any) => ({
        trait_type: attr.trait_type,
        value: attr.value,
      })),
      image: `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/${imageData.IpfsHash}`,
    },
  })

  return metadataResponse.data
}
