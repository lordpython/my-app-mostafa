import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import styled from "styled-components"

interface AnswerFeedbackProps {
  isVisible: boolean
  isCorrect: boolean
  message: string
}

export const AnswerFeedback: React.FC<AnswerFeedbackProps> = ({
  isVisible,
  isCorrect,
  message,
}) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 flex items-center justify-center"
      >
        <FeedbackOverlay isCorrect={isCorrect}>
          <h1 className="text-4xl font-bold">{message}</h1>
        </FeedbackOverlay>
      </motion.div>
    )}
  </AnimatePresence>
)

const FeedbackOverlay = styled.div<{ isCorrect: boolean }>`
  background-color: ${props => (props.isCorrect ? "green" : "red")};
  color: white;
  padding: 2rem;
  border-radius: 1rem;
`

export default AnswerFeedback
