/* eslint-disable @next/next/no-img-element */

import type { NextPage } from 'next'
import { BaseLayout } from '@ui'

import HeroSection from 'components/pages/home/HeroSection'
import BarrelsSection from 'components/pages/home/BarrelsSection'
import OwnerSection from 'components/pages/home/OwnerSection'
import NewsletterSection from 'components/pages/home/NewsletterSection'

const Home: NextPage = () => {
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
