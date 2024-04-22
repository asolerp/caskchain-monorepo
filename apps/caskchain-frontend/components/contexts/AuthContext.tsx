import { User } from 'firebase/auth'
import { SignOutUser, userStateListener } from 'lib/firebase/firebase'

import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from 'react'

interface Props {
  children?: ReactNode
}

export const AuthContext = createContext({
  // "User" comes from firebase auth-public.d.ts
  currentUser: {} as User | null,
  setCurrentUser: (_user: User) => {},
  signOut: () => {},
})

export const AuthProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = userStateListener((user) => {
      if (user) {
        setCurrentUser(user)
      }
    })
    return unsubscribe
  }, [setCurrentUser])

  // As soon as setting the current user to null,
  // the user will be redirected to the home page.
  const signOut = () => {
    SignOutUser()
    setCurrentUser(null)
  }

  const value = {
    currentUser,
    setCurrentUser,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
