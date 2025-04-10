import type React from "react"
import { useAppSelector } from "../../hooks/hooks"
import { motion } from "framer-motion"
import type { Team } from "../../types"
import useSound from 'use-sound';
import correctSound from '../../assets/sounds/correct.mp3';
import incorrectSound from '../../assets/sounds/incorrect.mp3';

interface GameResultsProps {
  teams: Team[];
}

const GameResults: React.FC<GameResultsProps> = ({ teams }) => {
  const { scores } = useAppSelector(state => state.game)
  const [playCorrectSound] = useSound(correctSound);
  const [playIncorrectSound] = useSound(incorrectSound);

  const highestScore = Math.max(...teams.map(team => scores[team.name as keyof typeof scores] || 0));
  const winningTeams = teams.filter(team => scores[team.name as keyof typeof scores] === highestScore);

  if (winningTeams.length === 1) {
    playCorrectSound();
  } else {
    playIncorrectSound();
  }

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
          <motion.div
            key={team.name}
            className="team-result mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold">{team.name}</h2>
            <p className="text-xl">
              Score: {scores[team.name as keyof typeof scores] || 0} pts
            </p>
          </motion.div>
        ))}
      </div>
      <div className="mt-6">
        {winningTeams.length === 1 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-green-500"
          >
            {winningTeams[0].name} Wins!
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-red-500"
          >
            It's a Tie!
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default GameResults
