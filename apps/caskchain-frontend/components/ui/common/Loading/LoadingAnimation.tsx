import { useEffect, useRef, useState } from 'react'
import type { LottiePlayer } from 'lottie-web'
import { flatten } from 'lottie-colorify'
import Loading from './loading.json'
import { motion } from 'framer-motion'

export const LoadingAnimation = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [lottie, setLottie] = useState<LottiePlayer | null>(null)

  useEffect(() => {
    import('lottie-web').then((Lottie) => setLottie(Lottie.default))
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  useEffect(() => {
    if (lottie && ref.current) {
      const animation = lottie.loadAnimation({
        container: ref.current,
        animationData: flatten('#CAFC01', Loading),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        // path to your animation file, place it inside public folder
      })

      return () => {
        animation.destroy()
      }
    }
  }, [lottie])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute w-screen h-screen bg-black-light bg-opacity-70 z-50"
    >
      <div
        className="absolute w-40 h-40 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        ref={ref}
      />
    </motion.div>
  )
}
