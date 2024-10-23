import type React from "react";
import { useState } from "react"
import type { FC } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../../components/ui/Button"
import type { Team } from "../../types"

interface TeamRegistrationProps {
  onRegister: (teams: Team[]) => void
}

interface PlayerInput {
  name: string
  role?: string
}

interface TeamInput {
  name: string
  players: PlayerInput[]
  color: string
}

const defaultColors = {
  teamA: "#4F46E5", // Indigo
  teamB: "#E11D48", // Rose
}

const TeamRegistration: FC<TeamRegistrationProps> = ({ onRegister }) => {
  const [teams, setTeams] = useState<TeamInput[]>([
    { name: "", players: [{ name: "" }, { name: "" }], color: defaultColors.teamA },
    { name: "", players: [{ name: "" }, { name: "" }], color: defaultColors.teamB },
  ])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const addPlayer = (teamIndex: number) => {
    if (teams[teamIndex].players.length < 4) {
      const updatedTeams = [...teams]
      updatedTeams[teamIndex].players.push({ name: "" })
      setTeams(updatedTeams)
    }
  }

  const removePlayer = (teamIndex: number, playerIndex: number) => {
    if (teams[teamIndex].players.length > 1) {
      const updatedTeams = [...teams]
      updatedTeams[teamIndex].players.splice(playerIndex, 1)
      setTeams(updatedTeams)
    }
  }

  const validateForm = () => {
    if (!teams[0].name.trim() || !teams[1].name.trim()) {
      setError("يجب إدخال أسماء الفريقين")
      return false
    }

    if (teams[0].name.toLowerCase() === teams[1].name.toLowerCase()) {
      setError("يجب أن تكون أسماء الفرق مختلفة")
      return false
    }

    for (const team of teams) {
      const playerNames = team.players
        .map(p => p.name.trim())
        .filter(name => name !== "")
      
      if (new Set(playerNames).size !== playerNames.length) {
        setError("يجب أن تكون أسماء اللاعبين في الفريق الواحد مختلفة")
        return false
      }
    }

    return true
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      if (!validateForm()) {
        return
      }
      
      await onRegister(teams.map(team => ({
        name: team.name,
        score: 0,
        players: team.players.filter(p => p.name).map(p => ({ name: p.name })),
        color: team.color
      })))
      
      setIsSuccess(true)
      await new Promise(resolve => setTimeout(resolve, 800))
    } catch (error) {
      setError("حدث خطأ أثناء بدء اللعبة")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-4xl mx-auto" dir="rtl">
        <motion.div
          className="text-center mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4 font-arabic">
            تسجيل الفرق
          </h1>
          <p className="text-gray-300 font-arabic">
            أدخل أسماء الفرق وتفاصيل اللاعبين
          </p>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              className="bg-red-500 text-white p-4 rounded-lg mb-6 text-center font-arabic"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teams.map((team, teamIndex) => (
            <motion.div
              key={teamIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: teamIndex * 0.2 }}
              className="glass-morphism rounded-xl p-6 relative"
              style={{ borderTop: `4px solid ${team.color}` }}
            >
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2 font-arabic">
                  {`اسم الفريق ${teamIndex + 1} *`}
                </label>
                <input
                  type="text"
                  value={team.name}
                  onChange={(e) => {
                    const updatedTeams = [...teams]
                    updatedTeams[teamIndex].name = e.target.value
                    setTeams(updatedTeams)
                  }}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md 
                           focus:ring-2 focus:ring-primary-500 focus:border-transparent 
                           text-white placeholder-white/50"
                  placeholder="أدخل اسم الفريق"
                  dir="rtl"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white font-arabic">اللاعبون</h3>
                {team.players.map((player, playerIndex) => (
                  <motion.div
                    key={playerIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={player.name}
                      onChange={(e) => {
                        const updatedTeams = [...teams]
                        updatedTeams[teamIndex].players[playerIndex].name = e.target.value
                        setTeams(updatedTeams)
                      }}
                      className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-md 
                               focus:ring-2 focus:ring-primary-500 focus:border-transparent 
                               text-white placeholder-white/50"
                      placeholder={`اسم اللاعب ${playerIndex + 1} (اختياري)`}
                      dir="rtl"
                    />
                    <Button
                      onClick={() => removePlayer(teamIndex, playerIndex)}
                      variant="danger"
                      className="p-2"
                    >
                      ✕
                    </Button>
                  </motion.div>
                ))}
              </div>

              {team.players.length < 4 && (
                <Button
                  onClick={() => addPlayer(teamIndex)}
                  variant="secondary"
                  className="mt-4 w-full font-arabic"
                >
                  + إضافة لاعب
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={handleSubmit}
            variant="primary"
            size="large"
            className="px-8 py-3 text-xl font-arabic"
            isLoading={isLoading}
          >
            {isLoading ? 'جارٍ التحضير...' : 'بدء اللعبة'}
          </Button>
        </motion.div>

        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-white rounded-lg p-8 text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  🎮
                </motion.div>
                <p className="text-xl font-bold font-arabic">جارٍ بدء اللعبة!</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default TeamRegistration
