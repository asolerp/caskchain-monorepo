/* eslint-disable @next/next/no-img-element */

import type { NextPage } from 'next'
import { BaseLayout } from '@ui'

import HeroSection from 'components/pages/home/HeroSection'
import BarrelsSection from 'components/pages/home/BarrelsSection'
import OwnerSection from 'components/pages/home/OwnerSection'

const Home: NextPage = () => {
  return (
    <>
      <BaseLayout>
        <HeroSection />
        <BarrelsSection />
        <OwnerSection />
      </BaseLayout>
    </>
  )
}

export default Home
