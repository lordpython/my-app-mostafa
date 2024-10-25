// src/components/TeamRegistration.tsx

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppDispatch } from '../hooks/hooks'
import { registerTeams, setGamePhase } from '../features/game/gameSlice'
import type { Team, Player } from '../types/game'
import { Button } from './ui/Button'

interface PlayerInput extends Omit<Player, 'id'> {
  error?: string
}

interface TeamInput extends Omit<Team, 'id' | 'score'> {
  players: PlayerInput[]
  error?: string
}

const MAX_PLAYERS = 4
const MIN_PLAYERS = 2

const TeamRegistration: React.FC = () => {
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [teams, setTeams] = useState<TeamInput[]>([
    {
      name: '',
      players: [{ name: '' }, { name: '' }],
      color: '#4F46E5'
    },
    {
      name: '',
      players: [{ name: '' }, { name: '' }],
      color: '#E11D48'
    }
  ])

  const validateTeams = (): boolean => {
    let isValid = true
    const updatedTeams = teams.map(team => {
      const validatedTeam = { ...team }
      
      // Validate team name
      if (!team.name.trim()) {
        validatedTeam.error = 'اسم الفريق مطلوب'
        isValid = false
      } else if (team.name.length < 3) {
        validatedTeam.error = 'اسم الفريق قصير جداً'
        isValid = false
      }

      // Validate players
      validatedTeam.players = team.players.map(player => {
        const validatedPlayer = { ...player }
        if (!player.name.trim()) {
          validatedPlayer.error = 'اسم اللاعب مطلوب'
          isValid = false
        }
        return validatedPlayer
      })

      return validatedTeam
    })

    // Check for duplicate team names
    if (teams[0].name.toLowerCase() === teams[1].name.toLowerCase()) {
      updatedTeams[0].error = 'يجب أن تكون أسماء الفرق مختلفة'
      updatedTeams[1].error = 'يجب أن تكون أسماء الفرق مختلفة'
      isValid = false
    }

    setTeams(updatedTeams)
    return isValid
  }

  const handleSubmit = async () => {
    if (!validateTeams()) return

    setIsLoading(true)
    try {
      const formattedTeams = teams.map((team, index) => ({
        id: `team${index === 0 ? 'A' : 'B'}` as const,
        name: team.name,
        players: team.players.map(player => ({
          ...player,
          id: crypto.randomUUID()
        })),
        color: team.color,
        score: 0
      }))

      await dispatch(registerTeams({
        teamA: formattedTeams[0],
        teamB: formattedTeams[1]
      })).unwrap()

      dispatch(setGamePhase('categorySelection'))
    } catch (error) {
      console.error('Error registering teams:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPlayer = (teamIndex: number) => {
    if (teams[teamIndex].players.length >= MAX_PLAYERS) return

    setTeams(current => {
      const updated = [...current]
      updated[teamIndex] = {
        ...updated[teamIndex],
        players: [...updated[teamIndex].players, { name: '' }]
      }
      return updated
    })
  }

  const handleRemovePlayer = (teamIndex: number, playerIndex: number) => {
    if (teams[teamIndex].players.length <= MIN_PLAYERS) return

    setTeams(current => {
      const updated = [...current]
      updated[teamIndex] = {
        ...updated[teamIndex],
        players: updated[teamIndex].players.filter((_, index) => index !== playerIndex)
      }
      return updated
    })
  }

  const handleUpdatePlayerName = (teamIndex: number, playerIndex: number, name: string) => {
    setTeams(current => {
      const updated = [...current]
      updated[teamIndex].players[playerIndex] = {
        ...updated[teamIndex].players[playerIndex],
        name,
        error: undefined
      }
      updated[teamIndex].error = undefined
      return updated
    })
  }

  const handleUpdateTeamName = (teamIndex: number, name: string) => {
    setTeams(current => {
      const updated = [...current]
      updated[teamIndex] = {
        ...updated[teamIndex],
        name,
        error: undefined
      }
      return updated
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary-900/20 to-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h1 className="text-4xl font-bold text-white mb-4 font-arabic">
            تسجيل الفرق
          </h1>
          <p className="text-lg text-white/70 font-arabic">
            قم بتسجيل فريقين للمنافسة ({MIN_PLAYERS}-{MAX_PLAYERS} لاعبين لكل فريق)
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teams.map((team, teamIndex) => (
            <motion.div
              key={teamIndex}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-xl"
              style={{ borderTop: `4px solid ${team.color}` }}
              initial={{ opacity: 0, x: teamIndex === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: teamIndex * 0.2 }}
            >
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2 font-arabic">
                  اسم الفريق {teamIndex + 1}
                </label>
                <input
                  type="text"
                  value={team.name}
                  onChange={e => handleUpdateTeamName(teamIndex, e.target.value)}
                  className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white
                    ${team.error ? 'border-red-500 ring-1 ring-red-500' : 'border-white/20'}
                    focus:ring-2 focus:ring-primary-500 transition-all duration-200`}
                  placeholder="أدخل اسم الفريق"
                  dir="rtl"
                />
                {team.error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-500 font-arabic"
                  >
                    {team.error}
                  </motion.p>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white font-arabic">
                  اللاعبون
                </h3>
                
                {team.players.map((player, playerIndex) => (
                  <motion.div
                    key={playerIndex}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: playerIndex * 0.1 }}
                  >
                    <div className="flex-1">
                      <input
                        type="text"
                        value={player.name}
                        onChange={e => handleUpdatePlayerName(
                          teamIndex,
                          playerIndex,
                          e.target.value
                        )}
                        className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white
                          ${player.error ? 'border-red-500 ring-1 ring-red-500' : 'border-white/20'}
                          focus:ring-2 focus:ring-primary-500 transition-all duration-200`}
                        placeholder={`اللاعب ${playerIndex + 1}`}
                        dir="rtl"
                      />
                      {player.error && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-1 text-sm text-red-500 font-arabic"
                        >
                          {player.error}
                        </motion.p>
                      )}
                    </div>
                    
                    {team.players.length > MIN_PLAYERS && (
                      <Button
                        onClick={() => handleRemovePlayer(teamIndex, playerIndex)}
                        variant="danger"
                        className="p-2 aspect-square"
                        title="حذف اللاعب"
                      >
                        ✕
                      </Button>
                    )}
                  </motion.div>
                ))}

                {team.players.length < MAX_PLAYERS && (
                  <Button
                    onClick={() => handleAddPlayer(teamIndex)}
                    variant="secondary"
                    className="w-full font-arabic"
                  >
                    + إضافة لاعب
                  </Button>
                )}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-white mb-2 font-arabic">
                  لون الفريق
                </label>
                <input
                  type="color"
                  value={team.color}
                  onChange={e => {
                    const updated = [...teams]
                    updated[teamIndex].color = e.target.value
                    setTeams(updated)
                  }}
                  className="w-full h-10 rounded cursor-pointer bg-white/10"
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={isLoading}
            size="large"
            className="px-12 py-4 text-lg font-arabic"
          >
            {isLoading ? 'جارٍ التسجيل...' : 'ابدأ اللعبة'}
          </Button>
        </motion.div>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/10 rounded-xl p-8 text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4" />
              <p className="text-white font-arabic">جارٍ تجهيز اللعبة...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TeamRegistration