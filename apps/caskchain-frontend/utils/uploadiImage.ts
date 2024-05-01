import { storage } from './firebase'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

function uploadImage(file: File, path: string, onSuccess: any) {
  const storageRef = ref(storage, path)
  const uploadTask = uploadBytesResumable(storageRef, file)

  uploadTask.on(
    'state_changed',
    (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      console.log('Upload is ' + progress + '% done')
    },
    (error) => {
      // Handle unsuccessful uploads
      console.log(error)
    },
    () => {
      // Handle successful uploads on complete
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        onSuccess && onSuccess(downloadURL)
        console.log('File available at', downloadURL)
      })
    }
  )
}

export default uploadImage
