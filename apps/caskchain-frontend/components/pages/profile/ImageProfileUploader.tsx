import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'

import axiosClient from 'lib/fetcher/axiosInstance'
import Image from 'next/image'
import React, { useState } from 'react'
import ImageUploading from 'react-images-uploading'
import uploadImage from 'utils/uploadiImage'

const ImageProfileUploader = () => {
  const [image, setImage] = useState<any>([])
  const {
    dispatch,
    state: { user, address },
  } = useGlobal()
  const onChange = async (imageList: any) => {
    // data for submit
    console.log(user)
    const secureURL = await uploadImage(
      imageList[0].file,
      `caskchain/users/${address}/profile/${imageList[0].file.name}`
    )
    console.log('secureURL', secureURL)
    await axiosClient.post('/api/user', {
      id: user._id,
      imageProfile: secureURL,
    })
    dispatch({
      type: GlobalTypes.SET_USER,
      payload: { user: { ...user, imageProfile: secureURL } },
    })
    setImage(imageList)
  }

  return (
    <ImageUploading value={image} onChange={onChange} dataURLKey="data_url">
      {({ onImageUpload }) => (
        <div className="relative hover:opacity-40 cursor-pointer border-2 border-gray-500 rounded-full">
          <Image
            src={
              image[0]?.data_url || user?.imageProfile || '/images/avatar.png'
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
