import { BaseLayout } from '@ui'
import Header from '@ui/layout/Header'

import { NextPage } from 'next'
import ProfileTabs from './componets/ProfileTabs'
import Spacer from '@ui/common/Spacer'

import { auth } from 'utils/auth'
// import { magic } from 'lib/magic'
// import { SignOutUser } from 'lib/firebase/firebase'

// const onNoAuthToken = async () => {
//   await (magic as any)?.wallet.disconnect()
//   SignOutUser()
// }

export const getServerSideProps = (context: any) => auth(context)

const About: NextPage = () => {
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
