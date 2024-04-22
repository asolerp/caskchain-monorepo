import { BaseLayout } from '@ui'
import Header from '@ui/layout/Header'

import { NextPage } from 'next'
import Spacer from '@ui/common/Spacer'

import CellarTabs from './componets/CellarTabs'
import { useRouter } from 'next/router'
import { useAuth } from 'components/contexts/AuthContext'
import { useEffect } from 'react'

const Cellar: NextPage = () => {
  const router = useRouter()
  const { currentUser } = useAuth()
  useEffect(() => {
    if (!currentUser) {
      router.push('/')
    }
  }, [currentUser, router])

  return (
    <BaseLayout background="bg-black-light">
      <div>
        <Header>
          <h1 className="font-rale font-semibold text-6xl text-cask-chain mb-10">
            My <span className="text-white">Cellar</span>
          </h1>
        </Header>
        <Spacer size="xl" />
        <div className="px-32 flex justify-center min-h-[700px]">
          <CellarTabs />
        </div>
      </div>
    </BaseLayout>
  )
}

export default Cellar
