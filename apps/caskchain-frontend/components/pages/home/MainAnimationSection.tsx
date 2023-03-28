import useWindowDimensions from '@hooks/common/useWindowDimensions'
import { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import Image from 'next/image'
import { useGlobal } from '@providers/global'
import { GlobalTypes } from '@providers/global/utils'

const MainAnimationSection = () => {
  const [startMainAnimation, setStartMainAnimation] = useState(false)

  const {
    dispatch,
    state: { mainAnimationFinished },
  } = useGlobal()

  const mainAnimationControl = useAnimation()
  const { height } = useWindowDimensions()

  useEffect(() => {
    setTimeout(() => {
      setStartMainAnimation(true)
    }, 1500)
  }, [])

  useEffect(() => {
    if (startMainAnimation && !mainAnimationFinished) {
      mainAnimationControl.start('visible')
    }
  }, [startMainAnimation])

  const mainVariants = {
    visible: { opacity: 1, y: -height },
    hidden: { opacity: 0 },
  }

  if (!mainAnimationFinished) {
    return (
      <motion.div
        exit="hidden"
        animate={mainAnimationControl}
        variants={mainVariants}
        transition={{ duration: 0.5 }}
        onAnimationComplete={() =>
          dispatch({
            type: GlobalTypes.SET_MAIN_ANIMATION_FINISHED,
            payload: { state: true },
          })
        }
        className="h-screen w-full flex justify-center items-center bg-black-light absolute top-0 left-0 z-50 trnslate-y-32"
      >
        <Image
          src="/images/logo.svg"
          width={300}
          height={200}
          className="object-cover"
          alt="cc"
        />
      </motion.div>
    )
  }

  return null
}

export default MainAnimationSection
