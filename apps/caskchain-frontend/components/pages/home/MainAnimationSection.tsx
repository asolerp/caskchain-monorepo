import useWindowDimensions from '@hooks/common/useWindowDimensions'

import { motion, useAnimation } from 'framer-motion'
import Image from 'next/image'
import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'
import { useRouter } from 'next/router'
import TranslateYAnimation from '@ui/animations/TranslateYAnimation'

const MainAnimationSection = () => {
  const route = useRouter()

  const {
    dispatch,
    state: { mainAnimationFinished },
  } = useGlobal()

  const mainAnimationControl = useAnimation()
  const { height } = useWindowDimensions()

  const mainVariants = {
    visible: { opacity: 1, y: -height },
    hidden: { opacity: 0 },
  }

  if (!mainAnimationFinished && route.pathname === '/') {
    return (
      <motion.div
        exit="hidden"
        animate={mainAnimationControl}
        variants={mainVariants}
        transition={{ delay: 1, duration: 0.5 }}
        onAnimationComplete={() =>
          dispatch({
            type: GlobalTypes.SET_MAIN_ANIMATION_FINISHED,
            payload: { state: true },
          })
        }
        className="h-screen w-full flex justify-center items-center bg-black-light absolute top-0 left-0 z-50 trnslate-y-32"
      >
        <TranslateYAnimation
          onAnimateComplete={() => mainAnimationControl.start('visible')}
        >
          <Image
            src="/images/logo.svg"
            width={300}
            height={200}
            className="object-cover h-auto"
            alt="cc"
            priority
          />
        </TranslateYAnimation>
      </motion.div>
    )
  }

  return null
}

export default MainAnimationSection
