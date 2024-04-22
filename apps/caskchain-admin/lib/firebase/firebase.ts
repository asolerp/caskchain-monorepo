import { initializeApp } from 'firebase/app'
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithCustomToken,
  NextOrObserver,
  User,
} from 'firebase/auth'
import { getFirebaseConfig } from './firebase-config'

const app = initializeApp(getFirebaseConfig())
const auth = getAuth(app)

export const signInUser = async (customToken: string) => {
  if (!customToken) return

  return await signInWithCustomToken(auth, customToken)
}

export const userStateListener = (callback: NextOrObserver<User>) => {
  return onAuthStateChanged(auth, callback)
}

export const SignOutUser = async () => await signOut(auth)
