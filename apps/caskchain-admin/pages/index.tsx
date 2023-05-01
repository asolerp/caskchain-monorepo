/* eslint-disable @next/next/no-img-element */

import type { NextPage } from 'next'
import { Button, Spacer } from 'caskchain-ui'

import { AnimatePresence } from 'framer-motion'
import { useAccount } from '@hooks/web3'
import { useAuth } from '@hooks/auth'
import Image from 'next/image'
import { useGlobal } from '@providers/global'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

const Home: NextPage = () => {
  useAuth()
  const { account } = useAccount()
  const { state: user } = useGlobal()
  const router = useRouter()

  const { query } = router

  useEffect(() => {
    if (query?.error === 'access_denied') {
      toast.error('You are not allowed to access this page.')
    }
  }, [query])

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [])

  return (
    <>
      <AnimatePresence>
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-black-light">
          <Image src="/images/logo.svg" alt="" width={400} height={200} />
          <h1 className="text-2xl font-bold font-poppins text-cask-chain mt-12">
            CaskChain Admin Portal
          </h1>
          <Spacer size="sm" />
          <Button
            containerStyle="rounded-full px-6 py-3"
            onClick={() => account.connect()}
          >
            Connect
          </Button>
        </div>
      </AnimatePresence>
    </>
  )
}

export default Home
