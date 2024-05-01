/* eslint-disable @next/next/no-img-element */

import type { NextPage } from 'next'
import { BaseLayout } from '@ui'

import HeroSection from 'components/pages/home/HeroSection'

import OwnerSection from 'components/pages/home/OwnerSection'
import NewsletterSection from 'components/pages/home/NewsletterSection'
import { useContext, useEffect } from 'react'
import { getCookie } from 'cookies-next'
import { magic } from 'lib/magic'
import { SignOutUser } from 'lib/firebase/firebase'
import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'

import { LoadingContext } from 'components/contexts/LoadingContext'
import BarrelsSection from 'components/pages/home/BarrelsSection'

const Home: NextPage = () => {
  const { dispatch } = useGlobal()
  const { setIsLoading } = useContext(LoadingContext)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [setIsLoading])

  useEffect(() => {
    const clearCredentials = async () => {
      localStorage.clear()
      dispatch({ type: GlobalTypes.SET_USER, payload: { user: null } })
      dispatch({ type: GlobalTypes.SET_ADDRESS, payload: { address: null } })
      await (magic as any)?.wallet.disconnect()
      SignOutUser()
    }
    const withCookie = getCookie('token')
    if (!withCookie) {
      clearCredentials()
    }
  }, [])

  return (
    <BaseLayout>
      <div id="modals" className="w-full">
        <HeroSection />
        <BarrelsSection />
        <OwnerSection />
        <NewsletterSection />
      </div>
    </BaseLayout>
  )
}

export default Home
