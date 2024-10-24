import type React from "react"
import { motion } from "framer-motion"
import type { Team } from "../../types"

interface TurnIndicatorProps {
  currentTeam: Team
  timeLeft: number
}

const TurnIndicator: React.FC<TurnIndicatorProps> = ({ currentTeam, timeLeft }) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div 
        className={`glass-morphism px-6 py-3 rounded-full flex items-center gap-4 team-color-border`}
        style={{ '--team-color': currentTeam.color } as React.CSSProperties}
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full animate-pulse team-color-bg"
            style={{ '--team-color': currentTeam.color } as React.CSSProperties}
          />
          <span className="font-bold text-white">{currentTeam.name}'s Turn</span>
        </div>
        <div className="text-white/80">
          {timeLeft}s
        </div>
      </div>
    </motion.div>
  )
}

export default TurnIndicator
