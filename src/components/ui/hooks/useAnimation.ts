import { useEffect, useState } from 'react'
import { useAnimation } from 'framer-motion'

export const useAnimatedEntry = (delay = 0) => {
  const controls = useAnimation()
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (!hasAnimated) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { delay, duration: 0.5 }
      })
      setHasAnimated(true)
    }
  }, [controls, delay, hasAnimated])

  return {
    initial: { opacity: 0, y: 20 },
    animate: controls
  }
}
