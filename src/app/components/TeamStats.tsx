import type React from "react"
import { motion } from "framer-motion"
import type { Team } from "../../types"

interface TeamStatsProps {
  team: Team
  questionsAnswered: number
  correctAnswers: number
  totalPoints: number
  powerUpsRemaining: number
}

const TeamStats: React.FC<TeamStatsProps> = ({
  team,
  questionsAnswered,
  correctAnswers,
  totalPoints,
  powerUpsRemaining
}) => {
  const accuracy = questionsAnswered > 0 
    ? Math.round((correctAnswers / questionsAnswered) * 100) 
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-morphism p-4 rounded-xl"
    >
      <h3 className={`text-xl font-bold mb-3 team-color-text`}
          style={{ '--team-color': team.color } as React.CSSProperties}>
        {team.name} Stats
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="stat-item">
          <p className="text-sm text-white/60">Accuracy</p>
          <p className="text-2xl font-bold">{accuracy}%</p>
        </div>
        <div className="stat-item">
          <p className="text-sm text-white/60">Points</p>
          <p className="text-2xl font-bold">{totalPoints}</p>
        </div>
        <div className="stat-item">
          <p className="text-sm text-white/60">Questions</p>
          <p className="text-2xl font-bold">{questionsAnswered}</p>
        </div>
        <div className="stat-item">
          <p className="text-sm text-white/60">Power-ups</p>
          <p className="text-2xl font-bold">{powerUpsRemaining}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default TeamStats
