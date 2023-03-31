/* eslint-disable @next/next/no-img-element */

import type { NextPage } from 'next'
import { BaseLayout } from '@ui'
import { AnimatePresence } from 'framer-motion'
import HeroSection from 'components/pages/home/HeroSection'
import BarrelsSection from 'components/pages/home/BarrelsSection'
import OwnerSection from 'components/pages/home/OwnerSection'
import NewsletterSection from 'components/pages/home/NewsletterSection'
import FooterSection from 'components/pages/home/FooterSection'
import MainAnimationSection from 'components/pages/home/MainAnimationSection'

const Home: NextPage = () => {
  return (
    <>
      <AnimatePresence>
        <BaseLayout>
          <div className="w-full">
            <MainAnimationSection />
            <HeroSection />
            <BarrelsSection />
            <OwnerSection />
            <NewsletterSection />
            <FooterSection />
          </div>
        </BaseLayout>
      </AnimatePresence>
    </>
  )
}

export default Home
