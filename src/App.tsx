// src/components/TriviaGame.tsx

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../hooks/hooks'
import { setGamePhase, setError } from '../features/game/gameSlice'
import { gameStateManager } from './managers/GameStateManager'
import { soundManager } from './managers/SoundManager'
import { questionController } from './controllers/QuestionController'
import HomeScreen from './app/components/HomeScreen'
import TeamRegistration from './app/components/TeamRegistration'
import CategorySelection from './app/components/CategorySelection'
import GameBoard from './app/components/GameBoard'
import QuestionDisplay from './QuestionDisplay'
import GameResults from './GameResults'
import { Button } from './ui/Button'

const TriviaGame: React.FC = () => {
  const dispatch = useAppDispatch()
  const { 
    phase, 
    teams, 
    currentTeam,
    error,
    soundEnabled 
  } = useAppSelector(state => state.game)

  const [isInitializing, setIsInitializing] = useState(true)

  // Initialize game and restore state if available
  useEffect(() => {
    const initializeGame = async () => {
      try {
        const savedState = gameStateManager.loadGameState()
        if (savedState) {
          // Restore game state
          dispatch(setGamePhase(savedState.phase))
          soundManager.setMute(!savedState.soundEnabled)
        }
      } catch (error) {
        console.error('Error initializing game:', error)
        dispatch(setError('فشل في تحميل اللعبة'))
      } finally {
        setIsInitializing(false)
      }
    }

    initializeGame()

    // Cleanup on unmount
    return () => {
      soundManager.cleanup()
      questionController.clearCache()
    }
  }, [dispatch])

  // Save game state on changes
  useEffect(() => {
    if (!isInitializing) {
      gameStateManager.saveGameState()
    }
  }, [phase, teams, currentTeam])

  // Handle sound effects
  useEffect(() => {
    soundManager.setMute(!soundEnabled)
  }, [soundEnabled])

  const handleEndGame = async () => {
    try {
      // Play sound effect
      soundManager.play('gameOver')

      // Clear game state
      gameStateManager.clearGameState()
      
      // Reset to home screen
      dispatch(setGamePhase('home'))
    } catch (error) {
      console.error('Error ending game:', error)
      dispatch(setError('فشل في إنهاء اللعبة'))
    }
  }

  const renderPhase = () => {
    switch (phase) {
      case 'home':
        return (
          <HomeScreen 
            onStart={() => {
              soundManager.play('select')
              dispatch(setGamePhase('registration'))
            }} 
          />
        )

      case 'registration':
        return (
          <TeamRegistration 
            onComplete={async (teams) => {
              soundManager.play('select')
              try {
                await gameStateManager.initializeGame(teams, [])
                dispatch(setGamePhase('categorySelection'))
              } catch (error) {
                console.error('Error in team registration:', error)
                dispatch(setError('فشل في تسجيل الفرق'))
              }
            }}
          />
        )

      case 'categorySelection':
        return (
          <CategorySelection 
            onSelect={async (categories) => {
              soundManager.play('select')
              try {
                // Prefetch questions for selected categories
                await Promise.all(
                  categories.map(category =>
                    questionController.prefetchCategoryQuestions(category, 'medium')
                  )
                )
                dispatch(setGamePhase('game'))
              } catch (error) {
                console.error('Error in category selection:', error)
                dispatch(setError('فشل في تحميل الأسئلة'))
              }
            }}
          />
        )

      case 'game':
        return (
          <GameBoard 
            onQuestionSelect={async (categoryId, points) => {
              soundManager.play('select')
              try {
                const question = await questionController.generateQuestion(
                  { id: categoryId },
                  'medium',
                  points
                )
                dispatch({ type: 'game/setCurrentQuestion', payload: question })
                dispatch(setGamePhase('question'))
              } catch (error) {
                console.error('Error generating question:', error)
                dispatch(setError('فشل في تحميل السؤال'))
              }
            }}
          />
        )

      case 'question':
        return (
          <QuestionDisplay 
            onAnswer={async (answer) => {
              try {
                const result = await gameStateManager.handleAnswer(
                  answer.questionId,
                  answer.answer,
                  answer.timeLeft
                )
                
                // Play appropriate sound
                soundManager.play(result.isCorrect ? 'correct' : 'wrong')
                
                setTimeout(() => {
                  dispatch(setGamePhase('game'))
                }, 2000)
              } catch (error) {
                console.error('Error validating answer:', error)
                dispatch(setError('فشل في التحقق من الإجابة'))
              }
            }}
          />
        )

      case 'results':
        return <GameResults onNewGame={handleEndGame} />

      default:
        return null
    }
  }

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4" />
          <p className="text-white font-arabic">جارٍ تحميل اللعبة...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Game Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="container mx-auto px-4 py-8"
        >
          {renderPhase()}
        </motion.div>
      </AnimatePresence>

      {/* Game Controls */}
      {phase !== 'home' && phase !== 'results' && (
        <motion.div
          className="fixed bottom-4 right-4 z-50 flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Button
            variant="secondary"
            onClick={() => dispatch({ type: 'game/toggleSound' })}
            className="p-2"
            title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </Button>
          
          <Button
            variant="danger"
            onClick={handleEndGame}
            className="font-arabic"
          >
            إنهاء اللعبة
          </Button>
        </motion.div>
      )}

      {/* Error Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
              <p className="font-arabic">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TriviaGame