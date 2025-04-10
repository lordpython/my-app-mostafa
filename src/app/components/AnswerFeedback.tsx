import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import styled from "styled-components"
import useSound from 'use-sound';
import correctSound from '../../assets/sounds/correct.mp3';
import incorrectSound from '../../assets/sounds/incorrect.mp3';

interface AnswerFeedbackProps {
  isVisible: boolean
  isCorrect: boolean
  message: string
}

export const AnswerFeedback: React.FC<AnswerFeedbackProps> = ({
  isVisible,
  isCorrect,
  message,
}) => {
  const [playCorrectSound] = useSound(correctSound);
  const [playIncorrectSound] = useSound(incorrectSound);

  if (isVisible) {
    if (isCorrect) {
      playCorrectSound();
    } else {
      playIncorrectSound();
    }
  }

  return (
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
}

const FeedbackOverlay = styled.div<{ isCorrect: boolean }>`
  background-color: ${props => (props.isCorrect ? "green" : "red")};
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  animation: ${props => (props.isCorrect ? "confetti 1s ease-out" : "shake 0.5s ease-in-out")};

  @keyframes confetti {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`
