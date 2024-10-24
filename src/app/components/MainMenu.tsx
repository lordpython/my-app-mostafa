import type { FC } from 'react'
import { motion } from "framer-motion"
import { Button } from "../../components/ui/Button"
import AnimatedContainer from "../../components/ui/AnimatedContainer"

export const MainMenu: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <AnimatedContainer animation="fadeIn" className="relative min-h-screen">
    <div className="absolute inset-0 bg-menu" />
    
    <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-primary-800/60 to-secondary-900/80" />

    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl font-bold text-white mb-6 font-arabic">
          لعبة المسابقات الثقافية
        </h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto font-arabic">
          تحدى معرفتك وتنافس مع الأصدقاء في مجموعة متنوعة من الأسئلة الثقافية
        </p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-6"
      >
        <Button
          onClick={onStart}
          variant="primary"
          size="large"
          className="text-xl px-12 py-6 font-arabic glass-morphism animate-pulse-glow"
        >
          تسجيل الفرق
        </Button>

        <div className="flex gap-4">
          <Button
            variant="secondary"
            size="medium"
            className="font-arabic glass-morphism"
          >
            كيفية اللعب
          </Button>
          <Button
            variant="secondary"
            size="medium"
            className="font-arabic glass-morphism"
          >
            عن اللعبة
          </Button>
        </div>
      </motion.div>

      {/* Version number or additional info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute bottom-4 text-white/70 text-sm font-arabic"
      >
        الإصدار 1.0.0
      </motion.div>
    </div>
  </AnimatedContainer>
)
