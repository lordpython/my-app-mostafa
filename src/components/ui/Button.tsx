// src/components/ui/Button.tsx
import type React from "react"
import { motion } from "framer-motion"
import styled from "styled-components"
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success"
  size?: "small" | "medium" | "large"
  isLoading?: boolean
  icon?: React.ReactNode
}

const StyledButton = styled(motion.button)<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  /* Size Variants */
  ${props => {
    switch (props.size) {
      case "small":
        return "padding: 0.5rem 1rem; font-size: 0.875rem;"
      case "large":
        return "padding: 1rem 2rem; font-size: 1.125rem;"
      default:
        return "padding: 0.75rem 1.5rem; font-size: 1rem;"
    }
  }}

  /* Color Variants */
  ${props => {
    switch (props.variant) {
      case "secondary":
        return "background: #4B5563; color: white; &:hover { background: #374151; }"
      case "danger":
        return "background: #DC2626; color: white; &:hover { background: #B91C1C; }"
      case "success":
        return "background: #059669; color: white; &:hover { background: #047857; }"
      default:
        return "background: #2563EB; color: white; &:hover { background: #1D4ED8; }"
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Loading Spinner */
  ${props =>
    props.isLoading &&
    `
    color: transparent !important;
    pointer-events: none;
    &::after {
      content: '';
      position: absolute;
      width: 1.25em;
      height: 1.25em;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 2px solid;
      border-radius: 50%;
      border-color: #fff #fff #fff transparent;
      animation: button-loading-spinner 0.75s linear infinite;
    }
  `}

  @keyframes button-loading-spinner {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  /* Ripple Effect */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.3s ease-out, height 0.3s ease-out;
  }

  &:active::before {
    width: 200%;
    height: 200%;
  }
`

// Change this to named export
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  isLoading = false,
  icon,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      isLoading={isLoading}
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
      {...props}
    >
      {icon && <span className="button-icon">{icon}</span>}
      {children}
    </StyledButton>
  )
}

// Add this for backward compatibility
export default Button
