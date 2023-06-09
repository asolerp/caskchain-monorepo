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
      animate={{ opacity: 0.7 }}
      exit={{ opacity: 0 }}
      className="fixed flex justify-center items-center top-0 left-0 w-full h-screen z-20 bg-gradient-to-r from-[#0F0F0F] via-[#161616] to-[#000000]"
    >
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="absolute w-40 h-40 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            ref={ref}
          />
        </div>
      </div>
    </motion.div>
  )
}
