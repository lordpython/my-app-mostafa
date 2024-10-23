import type React from "react"
import { useAppSelector } from "../../hooks/hooks"
import { motion } from "framer-motion"
import type { Team } from "../../types"

interface GameResultsProps {
  teams: Team[];
}

const GameResults: React.FC<GameResultsProps> = ({ teams }) => {
  const { scores } = useAppSelector(state => state.game)

  return (
    <motion.div
      className="game-results p-6"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6">Game Over</h1>
      <div className="flex flex-col items-center">
        {teams.map(team => (
          <div key={team.name} className="team-result mb-4">
            <h2 className="text-2xl font-semibold">{team.name}</h2>
            <p className="text-xl">
              Score: {scores[team.name as keyof typeof scores] || 0} pts
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default GameResults
