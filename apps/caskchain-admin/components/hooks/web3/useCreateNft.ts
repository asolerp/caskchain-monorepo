import { CryptoHookFactory } from '@_types/hooks'
import { NftMeta, PinataRes } from '@_types/nft'
import axios from 'axios'
import { ethers } from 'ethers'
import axiosClient from 'lib/fetcher/axiosInstance'
import { ChangeEvent, useState } from 'react'
import { toast } from 'react-toastify'

const ALLOWED_FIELDS = ['name', 'description', 'image', 'attributes']

type UseCreateNftResponse = {
  nftURI: string
  price: string
  nftImage: string
  file: File | null
  hasURI: boolean
  nftMeta: NftMeta
  setNftURI: (uri: string) => void
  setPrice: (price: string) => void
  setNftImage: (image: string) => void
  setFile: (file: File | null) => void
  setHasURI: (hasURI: boolean) => void
  setNftMeta: (nftMeta: NftMeta) => void
  handleNftMetaChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleNftMetaAttributeChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleNftMetaImageChange: (e: ChangeEvent<HTMLInputElement>) => void
  uploadMetaData: () => Promise<void>
  uploadImage: () => Promise<void>
  createNft: () => Promise<void>
}
type CreateNftHookFactory = CryptoHookFactory<UseCreateNftResponse>

export type UseCreateNftHook = ReturnType<CreateNftHookFactory>

export const hookFactory: CreateNftHookFactory =
  ({ ccNft, provider, nftVendor }) =>
  () => {
    const [nftURI, setNftURI] = useState('')
    const [price, setPrice] = useState('')
    const [nftImage, setNftImage] = useState('')
    const [activeLiquor, setActiveLiquor] = useState('brandy')
    const [file, setFile] = useState<File | null>(null)
    const [hasURI, setHasURI] = useState(false)
    const [nftMeta, setNftMeta] = useState<NftMeta>({
      name: '',
      description: '',
      image: '',
      attributes: [
        {
          trait_type: 'liquor',
          value: activeLiquor,
          type: 'text',
          editable: true,
        },
        { trait_type: 'age', value: '', type: 'number', editable: true },
        { trait_type: 'distillery', value: '', type: 'text', editable: true },
        { trait_type: 'type', value: '', type: 'text', editable: true },
        { trait_type: 'cask_wood', value: '', type: 'text', editable: true },
        { trait_type: 'cask_size', value: '', type: 'number', editable: true },
        { trait_type: 'location', value: '', type: 'text', editable: true },
        { trait_type: 'abv', value: '', type: 'number', editable: true },
        { trait_type: 'flavor', value: '', type: 'text', editable: true },
        { trait_type: 'rarity', value: '', type: 'text', editable: true },
        { trait_type: 'historical', value: '', type: 'text', editable: true },
        { trait_type: 'awards', value: '', type: 'text', editable: true },
      ],
    })

    const handleActiveLiquorChange = (
      liquor: 'brandy' | 'wiskey' | 'rum' | 'tequila'
    ) => {
      setActiveLiquor(liquor)
      const attributesWithoutLiquor = nftMeta.attributes.filter(
        (attr: any) => attr.trait_type !== 'liquor'
      )
      setNftMeta({
        ...nftMeta,
        attributes: [
          {
            trait_type: 'liquor',
            value: liquor,
            type: 'text',
            editable: false,
          },
          ...attributesWithoutLiquor,
        ],
      })
    }

    const handleChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target
      setNftMeta({ ...nftMeta, [name]: value })
    }

    const handleAttributeChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      const attributeIndex = nftMeta.attributes.findIndex(
        (attr: any) => attr.trait_type === name
      )
      nftMeta.attributes[attributeIndex].value = value
      setNftMeta({
        ...nftMeta,
        attributes: nftMeta.attributes,
      })
    }

    const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) {
        console.error('Select a file')
        return
      }
      const file = e.target.files[0]
      const imageURL = URL.createObjectURL(file)

      setFile(file)
      setNftImage(imageURL)
    }

    const uploadMetaData = async () => {
      const id = toast.loading('Uploadnig metada...')
      try {
        if (!file) return

        const buffer = await file!.arrayBuffer()
        const bytes = new Uint8Array(buffer)

        const imageResponse = await axiosClient.post(
          '/api/pin-nft/pin-image',
          {
            bytes,
            contentType: file!.type,
            fileName: file!.name.replace(/\.[^/.]+$/, ''),
          },
          { withCredentials: true }
        )

        const imageData = imageResponse.data as PinataRes

        const res = await axiosClient.post(
          '/api/pin-nft/pin-metadata',
          {
            nft: {
              ...nftMeta,
              attributes: nftMeta.attributes.map((attr: any) => ({
                trait_type: attr.trait_type,
                value: attr.value,
              })),
              image: `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/${imageData.IpfsHash}`,
            },
          },
          { withCredentials: true }
        )

        const data = res.data as unknown as PinataRes
        setNftURI(
          `${process.env.NEXT_PUBLIC_PINATA_PUBLIC_URL}/${data.IpfsHash}`
        )
        toast.update(id, {
          render: 'Metadata uploaded',
          type: 'success',
          isLoading: false,
          closeOnClick: true,
          autoClose: 2000,
        })
      } catch (e: any) {
        console.error(e.message)
        toast.update(id, {
          render: 'Something went wrong',
          type: 'error',
          isLoading: false,
          closeOnClick: true,
          autoClose: 2000,
        })
      }
    }

    const createNft = async () => {
      const id = toast.loading('Listing new barrel...')
      const ipfsHash = nftURI.split('/ipfs/')[1]
      try {
        const nftRes = await axios.get(
          `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/${ipfsHash}?pinataGatewayToken=${process.env.NEXT_PUBLIC_PINATA_GATEWAY_TOKEN}`
        )
        const content = nftRes.data

        Object.keys(content).forEach((key) => {
          if (!ALLOWED_FIELDS.includes(key)) {
            throw new Error('Invalid Json structure')
          }
        })

        const gasPrice = await provider?.getGasPrice()

        const txMint = await ccNft?.mintNFT(nftURI)

        const responseMint: any = await txMint!.wait()

        if (responseMint.status !== 1) throw new Error('Minting failed')

        const tokenId = responseMint.events[0].args[2].toNumber()

        const txApprove = await ccNft?.approve(
          nftVendor!.address as string,
          tokenId,
          {
            gasPrice,
            gasLimit: 100000,
          }
        )

        const responseApprove: any = await txApprove!.wait()

        if (responseApprove.status !== 1) throw new Error('Approve failed')

        const txList = await nftVendor?.listItem(
          tokenId,
          ethers.utils.parseUnits(price.toString(), 'ether')
        )

        const responseList: any = await txList!.wait()

        if (responseList.status !== 1) throw new Error('Listing failed')

        toast.update(id, {
          render: 'NFT listed',
          type: 'success',
          isLoading: false,
          closeOnClick: true,
          autoClose: 2000,
        })
      } catch (e: any) {
        toast.update(id, {
          render: 'Something went wrong',
          type: 'error',
          isLoading: false,
          closeOnClick: true,
          autoClose: 2000,
        })
        console.error(e.message)
      }
    }

    return {
      file,
      price,
      nftURI,
      hasURI,
      nftMeta,
      nftImage,
      setPrice,
      setNftURI,
      setHasURI,
      createNft,
      handleImage,
      handleChange,
      activeLiquor,
      uploadMetaData,
      handleAttributeChange,
      handleActiveLiquorChange,
    }
  }
