import { CryptoHookFactory } from '@_types/hooks'
import { NftMeta } from '@_types/nft'

import axios from 'axios'

import { useMutation } from '@tanstack/react-query'

import { ChangeEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { pinImageAndMetadata } from 'pages/api/pinatta/pinImageAndMetadata'

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

export const useCreateNft = () => {
  const [nftURI, setNftURI] = useState('')
  const [price, setPrice] = useState('')
  const [nftImage, setNftImage] = useState('')
  const [activeLiquor, setActiveLiquor] = useState('brandy')
  const [file, setFile] = useState<File | null>(null)
  const [hasURI, setHasURI] = useState(false)
  const [toastId, setToastId] = useState<any>(null)
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
      { trait_type: 'country', value: '', type: 'text', editable: true },
      { trait_type: 'region', value: '', type: 'text', editable: true },
      { trait_type: 'abv', value: '', type: 'number', editable: true },
      { trait_type: 'flavor', value: '', type: 'text', editable: true },
      { trait_type: 'rarity', value: '', type: 'text', editable: true },
      { trait_type: 'historical', value: '', type: 'text', editable: true },
      { trait_type: 'awards', value: '', type: 'text', editable: true },
    ],
  })

  const {
    data,
    mutate: handlePinImageAndMetadata,
    status,
  } = useMutation({
    mutationKey: ['pinImageAndMetadata'],
    mutationFn: () => pinImageAndMetadata(file, nftMeta),
  })

  useEffect(() => {
    if (status === 'success') {
      toast.update(toastId, {
        render: 'Metadata uploaded',
        type: 'success',
        isLoading: false,
        closeOnClick: true,
        autoClose: 2000,
      })
    }
    if (status === 'error') {
      toast.update(toastId, {
        render: 'Something went wrong',
        type: 'error',
        isLoading: false,
        closeOnClick: true,
        autoClose: 2000,
      })
    }
  }, [status])

  useEffect(() => {
    if (data) {
      setNftURI(
        `${process.env.NEXT_PUBLIC_PINATA_PUBLIC_URL}/${
          (data as any)?.IpfsHash
        }`
      )
    }
  }, [data])

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
    setToastId(id)
    handlePinImageAndMetadata()
  }

  const createNft = async () => {
    const id = toast.loading('Listing new barrel...')
    const ipfsHash = nftURI.split('/ipfs/')[1]

    try {
      await axios.post(
        'https://europe-west1-cask-chain.cloudfunctions.net/createNft',
        {
          ipfsHash,
          nftURI,
          price,
        }
      )
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
