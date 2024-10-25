// src/managers/GameManager.ts

import { gameStateManager } from './GameStateManager'
import { questionCacheManager } from './QuestionCacheManager'
import { soundManager } from './SoundManager'
import type { 
  Category, 
  Question, 
  Difficulty, 
  TeamId, 
  AnswerSubmission 
} from '../types/game'

class GameManager {
  private currentSessionId?: string
  private isInitialized = false

  async initializeGame(categories: Category[]): Promise<void> {
    try {
      // Start background music
      soundManager.playMusic('menuMusic')

      // Warm up question cache for all categories
      await questionCacheManager.warmupCache(
        categories,
        ['easy', 'medium', 'hard']
      )

      // Create new game session
      this.currentSessionId = crypto.randomUUID()
      this.isInitialized = true

      console.log('Game initialized successfully')
    } catch (error) {
      console.error('Failed to initialize game:', error)
      throw new Error('Game initialization failed')
    }
  }

  async getQuestion(
    category: Category,
    difficulty: Difficulty,
    points: number
  ): Promise<Question> {
    if (!this.isInitialized) {
      throw new Error('Game not initialized')
    }

    try {
      soundManager.play('select')
      
      const question = await questionCacheManager.getQuestion(
        category,
        difficulty,
        points
      )

      // Save game state
      await gameStateManager.saveState({
        currentQuestion: question,
        timestamp: Date.now()
      })

      return question
    } catch (error) {
      console.error('Failed to get question:', error)
      throw new Error('Failed to retrieve question')
    }
  }

  async submitAnswer(submission: AnswerSubmission): Promise<{
    isCorrect: boolean
    feedback: string
    points: number
    animation?: string
  }> {
    if (!this.isInitialized) {
      throw new Error('Game not initialized')
    }

    try {
      const result = await this.validateAnswer(submission)

      // Play appropriate sound
      soundManager.play(result.isCorrect ? 'correct' : 'wrong')

      // Calculate bonus points based on time
      const timeBonus = this.calculateTimeBonus(submission.timeLeft)
      const totalPoints = result.isCorrect ? result.points + timeBonus : 0

      // Update game state
      await gameStateManager.updateScore(submission.teamId, totalPoints)

      // Mark question as used
      questionCacheManager.markQuestionUsed(submission.questionId)

      return {
        ...result,
        points: totalPoints,
        animation: result.isCorrect ? 'success' : 'failure'
      }
    } catch (error) {
      console.error('Failed to submit answer:', error)
      throw new Error('Failed to process answer')
    }
  }

  private async validateAnswer(submission: AnswerSubmission): Promise<{
    isCorrect: boolean
    feedback: string
    points: number
  }> {
    const currentQuestion = await gameStateManager.getCurrentQuestion()
    if (!currentQuestion) {
      throw new Error('No active question')
    }

    // Simplified answer validation - replace with your actual validation logic
    const isCorrect = submission.answer.toLowerCase().trim() === 
      currentQuestion.correctAnswer.toLowerCase().trim()

    return {
      isCorrect,
      feedback: isCorrect ? 'إجابة صحيحة!' : 'إجابة خاطئة!',
      points: currentQuestion.points
    }
  }

  private calculateTimeBonus(timeLeft: number): number {
    const MAX_BONUS = 50
    const timePercentage = timeLeft / 60 // Assuming 60-second time limit
    return Math.floor(MAX_BONUS * timePercentage)
  }

  async switchTeams(): Promise<TeamId> {
    const currentTeam = await gameStateManager.getCurrentTeam()
    const nextTeam: TeamId = currentTeam === 'teamA' ? 'teamB' : 'teamA'
    
    soundManager.play('endTurn')
    await gameStateManager.setCurrentTeam(nextTeam)
    
    return nextTeam
  }

  async endGame(): Promise<void> {
    try {
      soundManager.play('gameOver')
      soundManager.playMusic('menuMusic')

      // Save final game state
      await gameStateManager.saveState({
        isComplete: true,
        endTime: Date.now()
      })

      // Clear caches
      questionCacheManager.clearCache()
      this.isInitialized = false
      this.currentSessionId = undefined

    } catch (error) {
      console.error('Failed to end game:', error)
      throw new Error('Failed to end game properly')
    }
  }

  getGameStats(): {
    questionStats: {
      total: number
      unused: number
      categories: Record<string, number>
    }
    timeElapsed: number
  } {
    const cacheStats = questionCacheManager.exportCacheStats()
    const gameState = gameStateManager.getState()

    return {
      questionStats: {
        total: cacheStats.totalQuestions,
        unused: cacheStats.unusedQuestions,
        categories: cacheStats.categoryCounts
      },
      timeElapsed: gameState.endTime ? 
        gameState.endTime - gameState.startTime : 
        Date.now() - gameState.startTime
    }
  }
}

export const gameManager = new GameManager()