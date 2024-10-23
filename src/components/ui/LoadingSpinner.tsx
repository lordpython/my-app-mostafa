import type { FC } from 'react'
import { motion } from "framer-motion"
import styled from "styled-components"

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large"
  color?: string
}

const SpinnerContainer = styled(motion.div)<LoadingSpinnerProps>`
  display: inline-block;
  width: ${props => {
    switch (props.size) {
      case "small":
        return "1.5rem"
      case "large":
        return "3rem"
      default:
        return "2rem"
    }
  }};
  height: ${props => {
    switch (props.size) {
      case "small":
        return "1.5rem"
      case "large":
        return "3rem"
      default:
        return "2rem"
    }
  }};
`

const Spinner = styled(motion.div)<LoadingSpinnerProps>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid ${props => props.color || "#3B82F6"};
  border-top-color: transparent;
`

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  color = "#3B82F6"
}) => {
  return (
    <SpinnerContainer size={size}>
      <Spinner
        size={size}
        color={color}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </SpinnerContainer>
  )
}

export default LoadingSpinner
