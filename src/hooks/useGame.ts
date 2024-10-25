// src/hooks/useGame.ts

import { useState, useCallback, useEffect } from 'react'
import { useAppDispatch } from './hooks'
import { gameManager } from '../managers/GameManager'
import { setError, updateScore, switchTeam } from '../features/game/gameSlice'
import type { 
  Category, 
  Question, 
  Difficulty, 
  AnswerSubmission 
} from '../types/game'

export const useGame = () => {
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)

  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      gameManager.endGame().catch(console.error)
    }
  }, [])

  const initializeGame = useCallback(async (categories: Category[]) => {
    setIsLoading(true)
    try {
      await gameManager.initializeGame(categories)
    } catch (error) {
      dispatch(setError('فشل في بدء اللعبة'))
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [dispatch])

  const getQuestion = useCallback(async (
    category: Category,
    difficulty: Difficulty,
    points: number
  ) => {
    setIsLoading(true)
    try {
      const question = await gameManager.getQuestion(
        category,
        difficulty,
        points
      )
      setCurrentQuestion(question)
      return question
    } catch (error) {
      dispatch(setError('فشل في تحميل السؤال'))
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [dispatch])

  const submitAnswer = useCallback(async (submission: AnswerSubmission) => {
    setIsLoading(true)
    try {
      const result = await gameManager.submitAnswer(submission)
      
      if (result.isCorrect) {
        dispatch(updateScore({
          teamId: submission.teamId,
          points: result.points
        }))
      }

      // Switch teams after answer
      await gameManager.switchTeams()
      dispatch(switchTeam())

      return result
    } catch (error) {
      dispatch(setError('فشل في التحقق من الإجابة'))
      throw error
    } finally {
      setIsLoading(false)
      setCurrentQuestion(null)
    }
  }, [dispatch])

  const endGame = useCallback(async () => {
    setIsLoading(true)
    try {
      await gameManager.endGame()
      setCurrentQuestion(null)
    } catch (error) {
      dispatch(setError('فشل في إنهاء اللعبة'))
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [dispatch])

  return {
    isLoading,
    currentQuestion,
    initializeGame,
    getQuestion,
    submitAnswer,
    endGame,
    getGameStats: gameManager.getGameStats
  }
}