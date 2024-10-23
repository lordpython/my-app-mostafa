import React from "react"
import { motion } from "framer-motion"
import { Button } from "../../components/ui/Button"
import type { Question } from "../../types"

interface MediaQuestionProps {
  question: Question
  onAnswer: (answer: string) => void
}

const MediaQuestion: React.FC<MediaQuestionProps> = ({ question, onAnswer }) => {
  const [answer, setAnswer] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onAnswer(answer)
      setAnswer("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="media-question p-6 max-w-4xl mx-auto"
      dir="rtl"
    >
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 text-right">
          {question.question}
        </h2>

        {/* Media Display */}
        <div className="media-container mb-6">
          {question.media?.type === 'image' ? (
            <div className="relative">
              <img
                src={question.media.url}
                alt={question.media.caption || "صورة السؤال"}
                className="w-full h-auto rounded-lg"
                loading="lazy"
              />
              {question.media.caption && (
                <p className="text-sm text-gray-600 mt-2 text-right">
                  {question.media.caption}
                </p>
              )}
            </div>
          ) : question.media?.type === 'video' ? (
            <div className="relative aspect-video">
              <video
                controls
                className="w-full h-full rounded-lg"
                poster={`${question.media.url}?poster=true`}
              >
                <source src={question.media.url} type="video/mp4" />
                متصفحك لا يدعم تشغيل الفيديو.
              </video>
              {question.media.caption && (
                <p className="text-sm text-gray-600 mt-2 text-right">
                  {question.media.caption}
                </p>
              )}
            </div>
          ) : null}
        </div>

        {/* Answer Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="answer"
              className="block text-sm font-medium text-gray-700 text-right"
            >
              إجابتك
            </label>
            <input
              type="text"
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                       focus:border-blue-500 focus:ring-blue-500 text-right"
              placeholder="اكتب إجابتك هنا..."
              disabled={isSubmitting}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="large"
            isLoading={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'جارٍ الإرسال...' : 'إرسال الإجابة'}
          </Button>
        </form>
      </div>
    </motion.div>
  )
}

export default MediaQuestion
