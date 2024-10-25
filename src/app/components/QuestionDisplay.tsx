import type React from "react";
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../../components/ui/Button"
import { Timer } from "../../components/Timer"
import type { Question } from "../../types"

interface QuestionDisplayProps {
  question: Question
  onAnswer: (answer: string) => void
  timeLeft: number// src/components/QuestionDisplay.tsx

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppSelector, useAppDispatch } from '../hooks/hooks'
import { submitAnswer, updateTimeLeft } from '../features/game/gameSlice'
import Button from './ui/Button'

const QuestionDisplay: React.FC = () => {
  const dispatch = useAppDispatch()
  const {
    currentQuestion,
    timeLeft,
    currentTeam,
    isAnswering,
    loading
  } = useAppSelector(state => state.game)

  const [answer, setAnswer] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean
    message: string
  } | null>(null)

  useEffect(() => {
    if (!isAnswering || timeLeft <= 0) return

    const timer = setInterval(() => {
      dispatch(updateTimeLeft(timeLeft - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, isAnswering, dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentQuestion || !currentTeam) return

    try {
      const result = await dispatch(submitAnswer({
        questionId: currentQuestion.id,
        teamId: currentTeam,
        answer,
        timeLeft
      })).unwrap()

      setFeedback({
        isCorrect: result.isCorrect,
        message: result.feedback
      })
      setShowFeedback(true)

      setTimeout(() => {
        setShowFeedback(false)
        setFeedback(null)
        setAnswer('')
      }, 3000)
    } catch (error) {
      console.error('Error submitting answer:', error)
    }
  }

  if (!currentQuestion) return null

  return (
    <div className="p-6 max-w-4xl mx-auto" dir="rtl">
      {/* Timer */}
      <div className="mb-6 flex justify-between items-center">
        <div className="text-xl font-bold">
          {currentTeam === 'teamA' ? 'الفريق الأول' : 'الفريق الثاني'}
        </div>
        <motion.div
          className={`text-2xl font-bold ${
            timeLeft <= 10 ? 'text-red-500' : 'text-white'
          }`}
          animate={{ scale: timeLeft <= 10 ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.5, repeat: timeLeft <= 10 ? Infinity : 0 }}
        >
          {timeLeft} ثانية
        </motion.div>
      </div>

      {/* Question Card */}
      <motion.div
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-white">
          {currentQuestion.question}
        </h2>
        
        {currentQuestion.media && (
          <div className="mb-4">
            {currentQuestion.media.type === 'image' ? (
              <img
                src={currentQuestion.media.url}
                alt={currentQuestion.media.caption || 'Question media'}
                className="rounded-lg max-w-full h-auto"
              />
            ) : currentQuestion.media.type === 'video' ? (
              <video
                src={currentQuestion.media.url}
                controls
                className="rounded-lg max-w-full"
              />
            ) : null}
            {currentQuestion.media.caption && (
              <p className="mt-2 text-sm text-white/70">
                {currentQuestion.media.caption}
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg
                     text-white placeholder-white/50 focus:ring-2 focus:ring-primary-500"
            placeholder="اكتب إجابتك هنا..."
            disabled={loading || !isAnswering || timeLeft === 0}
          />
          
          <Button
            type="submit"
            variant="primary"
            size="large"
            className="w-full"
            disabled={loading || !isAnswering || timeLeft === 0 || !answer.trim()}
            isLoading={loading}
          >
            {loading ? 'جارِ التحقق...' : 'إرسال الإجابة'}
          </Button>
        </form>
      </motion.div>

      {/* Feedback Overlay */}
      <AnimatePresence>
        {showFeedback && feedback && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`p-6 rounded-xl ${
                feedback.isCorrect ? 'bg-green-500' : 'bg-red-500'
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-2xl font-bold text-white mb-2">
                {feedback.isCorrect ? 'إجابة صحيحة!' : 'إجابة خاطئة'}
              </h3>
              <p className="text-white/90">{feedback.message}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default QuestionDisplay// src/components/QuestionDisplay.tsx

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppSelector, useAppDispatch } from '../hooks/hooks'
import { submitAnswer, updateTimeLeft } from '../features/game/gameSlice'
import Button from './ui/Button'

const QuestionDisplay: React.FC = () => {
  const dispatch = useAppDispatch()
  const {
    currentQuestion,
    timeLeft,
    currentTeam,
    isAnswering,
    loading
  } = useAppSelector(state => state.game)

  const [answer, setAnswer] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean
    message: string
  } | null>(null)

  useEffect(() => {
    if (!isAnswering || timeLeft <= 0) return

    const timer = setInterval(() => {
      dispatch(updateTimeLeft(timeLeft - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, isAnswering, dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentQuestion || !currentTeam) return

    try {
      const result = await dispatch(submitAnswer({
        questionId: currentQuestion.id,
        teamId: currentTeam,
        answer,
        timeLeft
      })).unwrap()

      setFeedback({
        isCorrect: result.isCorrect,
        message: result.feedback
      })
      setShowFeedback(true)

      setTimeout(() => {
        setShowFeedback(false)
        setFeedback(null)
        setAnswer('')
      }, 3000)
    } catch (error) {
      console.error('Error submitting answer:', error)
    }
  }

  if (!currentQuestion) return null

  return (
    <div className="p-6 max-w-4xl mx-auto" dir="rtl">
      {/* Timer */}
      <div className="mb-6 flex justify-between items-center">
        <div className="text-xl font-bold">
          {currentTeam === 'teamA' ? 'الفريق الأول' : 'الفريق الثاني'}
        </div>
        <motion.div
          className={`text-2xl font-bold ${
            timeLeft <= 10 ? 'text-red-500' : 'text-white'
          }`}
          animate={{ scale: timeLeft <= 10 ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.5, repeat: timeLeft <= 10 ? Infinity : 0 }}
        >
          {timeLeft} ثانية
        </motion.div>
      </div>

      {/* Question Card */}
      <motion.div
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-white">
          {currentQuestion.question}
        </h2>
        
        {currentQuestion.media && (
          <div className="mb-4">
            {currentQuestion.media.type === 'image' ? (
              <img
                src={currentQuestion.media.url}
                alt={currentQuestion.media.caption || 'Question media'}
                className="rounded-lg max-w-full h-auto"
              />
            ) : currentQuestion.media.type === 'video' ? (
              <video
                src={currentQuestion.media.url}
                controls
                className="rounded-lg max-w-full"
              />
            ) : null}
            {currentQuestion.media.caption && (
              <p className="mt-2 text-sm text-white/70">
                {currentQuestion.media.caption}
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg
                     text-white placeholder-white/50 focus:ring-2 focus:ring-primary-500"
            placeholder="اكتب إجابتك هنا..."
            disabled={loading || !isAnswering || timeLeft === 0}
          />
          
          <Button
            type="submit"
            variant="primary"
            size="large"
            className="w-full"
            disabled={loading || !isAnswering || timeLeft === 0 || !answer.trim()}
            isLoading={loading}
          >
            {loading ? 'جارِ التحقق...' : 'إرسال الإجابة'}
          </Button>
        </form>
      </motion.div>

      {/* Feedback Overlay */}
      <AnimatePresence>
        {showFeedback && feedback && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`p-6 rounded-xl ${
                feedback.isCorrect ? 'bg-green-500' : 'bg-red-500'
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-2xl font-bold text-white mb-2">
                {feedback.isCorrect ? 'إجابة صحيحة!' : 'إجابة خاطئة'}
              </h3>
              <p className="text-white/90">{feedback.message}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default QuestionDisplay
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
