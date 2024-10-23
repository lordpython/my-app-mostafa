import { useState } from "react"
import type { FC } from "react"
import { motion } from "framer-motion"
import { Button } from "../../components/ui/Button"
import MediaQuestion from "./MediaQuestion"
import AnimatedContainer from "../../components/ui/AnimatedContainer"
import type { Question } from "../../types"

interface QuestionCardProps {
  question: Question
  onSubmit: (answer: string) => void
}

const QuestionCard: FC<QuestionCardProps> = ({ question, onSubmit }) => {
  const [answer, setAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit(answer)
      setAnswer("")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (question.media) {
    return <MediaQuestion question={question} onAnswer={onSubmit} />
  }

  return (
    <AnimatedContainer animation="scaleIn" className="max-w-2xl mx-auto">
      <div className="question-card p-6 bg-white rounded-lg shadow-lg" dir="rtl">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold mb-6 text-right"
        >
          {question.question}
        </motion.h2>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <input
            type="text"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="اكتب إجابتك هنا..."
            className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
            onKeyPress={e => {
              if (e.key === 'Enter' && !isSubmitting) {
                handleSubmit()
              }
            }}
          />
          
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            className="w-full"
            size="large"
          >
            إرسال الإجابة
          </Button>
        </motion.div>
      </div>
    </AnimatedContainer>
  )
}

export default QuestionCard
