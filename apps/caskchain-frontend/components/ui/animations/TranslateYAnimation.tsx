import React from 'react'
import { motion } from 'framer-motion'

type Props = {
  onAnimateComplete?: () => void
  children: React.ReactNode
}

const TranslateYAnimation: React.FC<Props> = ({
  children,
  onAnimateComplete,
}) => {
  const [startAnimation, setStartAnimation] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setStartAnimation(true)
    }, 1000)
  }, [])

  const translateYAnimation = {
    hidden: { y: 200, transition: { duration: 1 } },
    visible: { y: 0, transition: { duration: 1 } },
  }

  return (
    <div className="overflow-hidden">
      <motion.div
        exit="hidden"
        initial="hidden"
        animate={startAnimation ? 'visible' : 'hidden'}
        variants={translateYAnimation}
        onAnimationComplete={(e) => {
          if (e === 'visible') {
            onAnimateComplete && onAnimateComplete()
          }
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export default TranslateYAnimation
