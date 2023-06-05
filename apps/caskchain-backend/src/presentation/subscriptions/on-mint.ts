import axios from 'axios'
import { CreateNFTUseCase } from '../../domain/interfaces/use-cases/create-nft-use-case'

export default function OnMint(createNFTUseCase: CreateNFTUseCase) {
  const handleOnTransfer = async (nft: any) => {
    const ipfsHash = nft.tokenURI.split('/ipfs/')[1]
    const pinataURL = `${process.env.PINATA_GATEWAY_URL}/${ipfsHash}?pinataGatewayToken=${process.env.PINATA_GATEWAY_TOKEN}`
    const metaResponse = await axios.get(pinataURL)
    const meta: any = await metaResponse.data

    await createNFTUseCase.execute(nft.tokenId, {
      name: meta.name,
      value: nft.value,
      pinata: nft.tokenURI,
      description: meta.description,
      image: meta.image,
      owner: {
        address: nft.owner,
      },
      attributes: meta.attributes.reduce((acc: any, attribute: any) => {
        acc[attribute.trait_type] = attribute.value
        return acc
      }, {}),
      favorites: 0,
    })
  }

  return handleOnTransfer
}
