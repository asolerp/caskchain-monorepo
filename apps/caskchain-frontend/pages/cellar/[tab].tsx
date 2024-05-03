import { BaseLayout } from '@ui'
import Header from '@ui/layout/Header'

import { NextPage } from 'next'
import Spacer from '@ui/common/Spacer'

import { auth } from 'utils/auth'
import CasksTab from '../../components/pages/cellar/CasksTab'

export const getServerSideProps = (context: any) => auth(context)

const Cellar: NextPage = () => {
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
          <CasksTab />
          {/* <CellarTabs /> */}
        </div>
      </div>
    </BaseLayout>
  )
}

export default Cellar
