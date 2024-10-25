// src/components/Question.tsx

import { useGame } from '../hooks/useGame'
import { Button } from './ui/Button'

const Question: React.FC<{
  category: Category
  points: number
}> = ({ category, points }) => {
  const { 
    isLoading, 
    currentQuestion, 
    getQuestion, 
    submitAnswer 
  } = useGame()

  const handleSelectQuestion = async () => {
    try {
      await getQuestion(category, 'medium', points)
    } catch (error) {
      console.error('Error selecting question:', error)
    }
  }

  const handleSubmitAnswer = async (answer: string) => {
    if (!currentQuestion) return

    try {
      const result = await submitAnswer({
        questionId: currentQuestion.id,
        answer,
        timeLeft: 60, // Replace with actual time left
        teamId: 'teamA' // Replace with current team
      })

      console.log('Answer result:', result)
    } catch (error) {
      console.error('Error submitting answer:', error)
    }
  }

  return (
    <div className="p-4">
      {!currentQuestion ? (
        <Button
          onClick={handleSelectQuestion}
          isLoading={isLoading}
          disabled={isLoading}
        >
          {points} نقطة
        </Button>
      ) : (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">{currentQuestion.question}</h3>
          {/* Add answer input and submission form */}
        </div>
      )}
    </div>
  )
}

export default Question