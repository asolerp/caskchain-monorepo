import { BaseLayout } from '@ui'
import Header from '@ui/layout/Header'

import { NextPage } from 'next'
import ProfileTabs from './componets/ProfileTabs'
import Spacer from '@ui/common/Spacer'
import { useEffect } from 'react'
import { useAuth } from 'components/contexts/AuthContext'
import { useRouter } from 'next/router'
// import { auth } from 'utils/auth'

// export const getServerSideProps = (context: any) => auth(context, 'user')

const About: NextPage = () => {
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
            My <span className="text-white">Profile</span>
          </h1>
        </Header>
        <Spacer size="xl" />
        <div className="px-32 flex justify-center">
          <ProfileTabs />
        </div>
      </div>
    </BaseLayout>
  )
}

export default About
