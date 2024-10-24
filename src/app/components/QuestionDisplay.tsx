import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../../components/ui/Button"
import { Timer } from "../../components/Timer"
import type { Question } from "../../types"

interface QuestionDisplayProps {
  question: Question
  onAnswer: (answer: string) => void
  timeLeft: number
  isReady: boolean
  onReady: () => void
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  onAnswer,
  timeLeft,
  isReady,
  onReady
}) => {
  const [answer, setAnswer] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAnswer(answer)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto" dir="rtl">
      <AnimatePresence mode="wait">
        {!isReady ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center space-y-6"
          >
            <h2 className="text-2xl font-bold">هل أنت مستعد للإجابة؟</h2>
            <Button
              onClick={onReady}
              variant="primary"
              size="large"
              className="animate-pulse-glow"
            >
              نعم، ابدأ السؤال
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">
                النقاط: {question.points}
              </span>
              <Timer timeLeft={timeLeft} />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
            >
              <h2 className="text-2xl font-bold mb-4">{question.question}</h2>
              
              {question.media && (
                <div className="mb-4">
                  {question.media.type === 'image' ? (
                    <img
                      src={question.media.url}
                      alt={question.media.caption || ''}
                      className="rounded-lg max-w-full h-auto"
                    />
                  ) : (
                    <video
                      src={question.media.url}
                      controls
                      className="rounded-lg max-w-full"
                    />
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg 
                           text-white placeholder-white/50 focus:ring-2 focus:ring-primary-500"
                  placeholder="اكتب إجابتك هنا..."
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  className="w-full mt-4"
                >
                  إرسال الإجابة
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default QuestionDisplay
