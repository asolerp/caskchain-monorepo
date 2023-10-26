const CLOUD_NAME = 'caskchain'
const UPLOAD_PRESET = 'caskchain' // The unsigned preset you noted earlier

function uploadImage(file: File, path: string): Promise<void> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('public_id', path) // Path where you want to save it

  return fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.secure_url) {
        console.log('File uploaded to:', data.secure_url)
        return data.secure_url
      } else {
        console.error('Error uploading file:', data)
      }
    })
    .catch((error) => {
      console.error('Error uploading file:', error)
    })
}

export default uploadImage
