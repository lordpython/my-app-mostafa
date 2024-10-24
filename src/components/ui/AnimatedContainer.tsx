import React, { type FC, type ReactNode } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import type { Variants } from "framer-motion"

interface AnimatedContainerProps {
  children: ReactNode
  animation?: "slideIn" | "fadeIn" | "scaleIn" | "bounceIn"
  duration?: number
  delay?: number
  className?: string
}

const animations: Record<string, Variants> = {
  slideIn: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 }
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  scaleIn: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 }
  },
  bounceIn: {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { type: "spring", bounce: 0.5 } },
    exit: { y: 20, opacity: 0 }
  }
}

const AnimatedContainer: FC<AnimatedContainerProps> = ({
  children,
  animation = "fadeIn",
  duration = 0.3,
  delay = 0,
  className = ""
}) => {
  return (
    <AnimatePresence>
      <motion.div
        variants={animations[animation]}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration, delay }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default AnimatedContainer
