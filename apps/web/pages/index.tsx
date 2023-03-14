/* eslint-disable @next/next/no-img-element */

import type { NextPage } from 'next'
import { BaseLayout } from '@ui'

import HeroSection from 'components/pages/home/HeroSection'

const Home: NextPage = () => {
  return (
    <>
      <BaseLayout>
        <HeroSection />
      </BaseLayout>
    </>
  )
}

export default Home
