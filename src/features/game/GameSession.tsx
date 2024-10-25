// src/features/game/GameSession.tsx

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppSelector, useAppDispatch } from '../../hooks/hooks'
import { setGamePhase, loadGameState, endGame } from './gameSlice'
import HomeScreen from '../../components/HomeScreen'
import TeamRegistration from '../../components/TeamRegistration'
import CategorySelection from '../../components/CategorySelection'
import GameBoard from '../../components/GameBoard'
import QuestionDisplay from '../../components/QuestionDisplay'
import GameResults from '../../components/GameResults'
import { gameService } from '../../services/gameService'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import Alert from '../../components/ui/Alert'

const GameSession: React.FC = () => {
  const dispatch = useAppDispatch()
  const { 
    phase, 
    error, 
    loading,
    selectedCategories,
    sessionId 
  } = useAppSelector(state => state.game)

  // Load or restore game session
  useEffect(() => {
    const savedSessionId = localStorage.getItem('gameSessionId')
    if (savedSessionId && phase === 'home') {
      dispatch(loadGameState(savedSessionId))
    }
  }, [dispatch, phase])

  // Prefetch questions when categories are selected
  useEffect(() => {
    if (selectedCategories.length > 0) {
      gameService.prefetchQuestions(selectedCategories, 'medium')
    }
  }, [selectedCategories])

  const handleEndGame = async () => {
    try {
      await dispatch(endGame()).unwrap()
      localStorage.removeItem('gameSessionId')
    } catch (error) {
      console.error('Error ending game:', error)
    }
  }

  const renderPhase = () => {
    switch (phase) {
      case 'home':
        return <HomeScreen onStart={() => dispatch(setGamePhase('registration'))} />
      case 'registration':
        return <TeamRegistration />
      case 'categorySelection':
        return <CategorySelection />
      case 'game':
        return <GameBoard />
      case 'question':
        return <QuestionDisplay />
      case 'results':
        return <GameResults onNewGame={handleEndGame} />
      default:
        return null
    }
  }

  // Loading overlay
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderPhase()}
        </motion.div>
      </AnimatePresence>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <Alert
            message={error}
            onClose={() => dispatch(setError(null))}
            type="error"
          />
        )}
      </AnimatePresence>

      {/* Game Controls */}
      {phase !== 'home' && phase !== 'results' && (
        <motion.div
          className="fixed bottom-4 right-4 z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={handleEndGame}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg
                     transition-colors duration-200 font-arabic"
          >
            إنهاء اللعبة
          </button>
        </motion.div>
      )}
    </div>
  )
}

export default GameSession