import { useGlobal } from '@providers/global'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import Image from 'next/image'
import { updateUser } from 'pages/api/user/updateUser'

import React, { useState, useEffect } from 'react'
import ImageUploading from 'react-images-uploading'
import { toast } from 'react-toastify'
import uploadImage from 'utils/uploadiImage'

const ImageProfileUploader = () => {
  const {
    state: { user, address },
  } = useGlobal()
  const [image, setImage] = useState<any>(null)

  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationKey: ['updateUser'],
    mutationFn: (data: any) => updateUser(address as string, data),
    onSuccess: () => {
      toast.success('Your profile image has been updated!', {
        theme: 'dark',
      })
      queryClient.invalidateQueries({ queryKey: ['getUserData', address] })
    },
    onError: () => {
      toast.error('The image was not updated! Try later', {
        theme: 'dark',
      })
    },
  })

  useEffect(() => {
    const upload = async () => {
      uploadImage(
        image[0]?.file,
        `users/${address}/profile/${image[0]?.file?.name}`,
        (downloadUrl: any) => mutate({ imageProfile: downloadUrl })
      )
    }
    if (image) {
      upload()
    }
  }, [image])

  const onChange = async (imageList: any) => {
    setImage(imageList)
  }

  return (
    <ImageUploading value={image} onChange={onChange} dataURLKey="data_url">
      {({ onImageUpload }) => (
        <div className="relative hover:opacity-40 cursor-pointer border-2 border-gray-500 rounded-full">
          <Image
            src={
              image?.[0]?.data_url || user?.imageProfile || '/images/avatar.png'
            }
            width={250}
            height={250}
            alt="profile"
            className="rounded-full w-[250px] h-[250px] object-cover"
          />
          <Image
            onClick={onImageUpload}
            src="/icons/image.png"
            width={80}
            height={80}
            alt="profile"
            className="absolute object-cover z-40 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      )}
    </ImageUploading>
  )
}

export default ImageProfileUploader
