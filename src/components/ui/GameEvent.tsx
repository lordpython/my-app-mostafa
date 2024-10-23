import type React from "react"
import { motion, AnimatePresence } from "framer-motion"

interface GameEventProps {
  type: 'bonus' | 'powerUp' | 'milestone' | 'teamwork'
  message: string
  icon: string
  isVisible: boolean
  onClose: () => void
}

const GameEvent: React.FC<GameEventProps> = ({
  type,
  message,
  icon,
  isVisible,
  onClose
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0, y: 50 }}
          className="fixed bottom-10 right-10 z-50"
        >
          <div className={`game-event-${type} glass-morphism p-4 rounded-xl flex items-center gap-4`}>
            <span className="text-3xl">{icon}</span>
            <div>
              <h4 className="font-bold text-white">{type.toUpperCase()}</h4>
              <p className="text-white/80">{message}</p>
            </div>
            <button 
              onClick={onClose}
              className="ml-4 text-white/60 hover:text-white"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GameEvent
