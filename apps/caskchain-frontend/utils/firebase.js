import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyB8HP7rr0y2AZ0Bhp4ErRtm5xkeF9h-Shg',
  authDomain: 'cask-chain.firebaseapp.com',
  projectId: 'cask-chain',
  storageBucket: 'cask-chain.appspot.com',
  messagingSenderId: '238553895266',
  appId: '1:238553895266:web:1cc09e257c987b190a9c3b',
  measurementId: 'G-C0EZEYX8RE',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)

export const analytics =
  typeof window !== 'undefined' ? getAnalytics(app) : null
export default app
