import type React from "react"
import { motion } from "framer-motion"
import styled from "styled-components"
import { theme } from "../../../styles/theme"
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success"
  size?: "small" | "medium" | "large"
  isLoading?: boolean
  icon?: React.ReactNode
}

// ... rest of your Button code, but updated to use theme colors
const StyledButton = styled(motion.button)<ButtonProps>`
  /* ... existing styles ... */
  
  /* Color Variants using theme */
  ${props => {
    switch (props.variant) {
      case "secondary":
        return `
          background: ${theme.colors.secondary.main}; 
          color: ${theme.colors.secondary.contrastText}; 
          &:hover { background: ${theme.colors.secondary.dark}; }
        `
      case "danger":
        return `
          background: ${theme.colors.error.main}; 
          color: ${theme.colors.error.contrastText}; 
          &:hover { background: ${theme.colors.error.dark}; }
        `
      // ... other variants
    }
  }}

  /* Add transition using theme */
  transition: all ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeOut};
`
