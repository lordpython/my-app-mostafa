import type React from "react"
import { motion } from "framer-motion"
import { Button } from "../../components/ui/Button"
import AnimatedContainer from "../../components/ui/AnimatedContainer"

interface HomeScreenProps {
  onStartPlay: () => void
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartPlay }) => (
  <AnimatedContainer animation="fadeIn" className="relative min-h-screen">
    <div className="absolute inset-0 bg-home" />
    
    {/* Overlay gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <h1 className="text-6xl font-bold text-white mb-4 font-arabic">
          مرحباً بكم في لعبة المسابقات
        </h1>
        <p className="text-xl text-white/80 font-arabic">
          اختبر معلوماتك وتحدى أصدقاءك في مجموعة متنوعة من الأسئلة
        </p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-4"
      >
        <Button
          onClick={onStartPlay}
          variant="primary"
          size="large"
          className="text-xl px-12 py-6 font-arabic glass-morphism"
        >
          ابدأ اللعب
        </Button>

        {/* Optional: Add more buttons or features */}
        <div className="flex gap-4 mt-6">
          <Button
            variant="secondary"
            size="medium"
            className="font-arabic glass-morphism"
          >
            القواعد
          </Button>
          <Button
            variant="secondary"
            size="medium"
            className="font-arabic glass-morphism"
          >
            الإعدادات
          </Button>
        </div>
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <p className="text-white/60 text-sm font-arabic">
          اضغط على زر "ابدأ اللعب" للبدء
        </p>
      </motion.div>
    </div>
  </AnimatedContainer>
)

export default HomeScreen
