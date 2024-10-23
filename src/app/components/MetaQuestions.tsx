import { useState } from "react"
import type { FC } from "react"
import { motion } from "framer-motion"
import Button from "../../components/ui/Button"
import type { MetaQuestion } from "../../types"
import { useAppDispatch, useAppSelector } from "../../hooks/hooks"
import { setGamePhase, updateScore } from "../../features/game/gameSlice"

const MetaQuestions: FC = () => {
  const dispatch = useAppDispatch()
  const { currentTeam } = useAppSelector(state => state.game)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  // Example meta questions - in production, these would come from your API
  const metaQuestions: MetaQuestion[] = [
    {
      id: "meta1",
      question: "What was the first question asked in this game?",
      points: 300,
      type: "recall"
    },
    {
      id: "meta2",
      question: "What category has been chosen the most?",
      points: 200,
      type: "analysis"
    },
    {
      id: "meta3",
      question: "What's the total score of both teams combined?",
      points: 100,
      type: "calculation"
    }
  ]

  const currentQuestion = metaQuestions[currentQuestionIndex]

  const handleAnswer = (_answer: string) => {
    // In production, this would validate against the actual game history
    const correct = Math.random() > 0.5 // Simulated validation
    setIsCorrect(correct)
    setShowFeedback(true)

    if (correct && currentTeam) {
      dispatch(updateScore({
        teamName: currentTeam,
        points: currentQuestion.points
      }))
    }

    setTimeout(() => {
      setShowFeedback(false)
      if (currentQuestionIndex < metaQuestions.length - 1) {
        setCurrentQuestionIndex((prevIndex: number) => prevIndex + 1)
      } else {
        dispatch(setGamePhase("game")) // Return to main game
      }
    }, 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="meta-questions-container p-6 max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Meta Round</h2>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-4">
          <span className="text-sm font-semibold text-gray-500">
            Question {currentQuestionIndex + 1} of {metaQuestions.length}
          </span>
        </div>

        <div className="question-card mb-6">
          <h3 className="text-xl font-semibold mb-2">
            {currentQuestion.question}
          </h3>
          <p className="text-gray-600">
            Points: {currentQuestion.points} | Type: {currentQuestion.type}
          </p>
        </div>

        {/* For demonstration, using simple text input */}
        <div className="answer-section">
          <input
            type="text"
            className="w-full p-2 border rounded mb-4"
            placeholder="Your answer..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAnswer((e.target as HTMLInputElement).value)
              }
            }}
          />
          <Button
            onClick={() => handleAnswer("sample answer")}
            className="w-full"
          >
            Submit Answer
          </Button>
        </div>

        {/* Feedback overlay */}
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50`}
          >
            <div className={`p-6 rounded-lg ${
              isCorrect ? 'bg-green-500' : 'bg-red-500'
            } text-white text-xl font-bold`}>
              {isCorrect ? 'Correct!' : 'Incorrect!'}
            </div>
          </motion.div>
        )}
      </div>

      {/* Progress indicator */}
      <div className="mt-4 flex justify-center gap-2">
        {metaQuestions.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentQuestionIndex
                ? 'bg-blue-500'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default MetaQuestions
