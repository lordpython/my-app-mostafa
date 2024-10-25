// src/managers/GameStateManager.ts

import { configureStore } from '@reduxjs/toolkit'
import gameReducer from '../features/game/gameSlice'
import { questionController } from '../controllers/QuestionController'
import type { GameState, Team, Category } from '../types/game'

export class GameStateManager {
  private store: ReturnType<typeof configureStore>

  constructor() {
    this.store = configureStore({
      reducer: {
        game: gameReducer
      }
    })
  }

  async initializeGame(teams: [Team, Team], categories: Category[]): Promise<void> {
    // Prefetch questions for all selected categories
    await Promise.all(
      categories.map(category =>
        questionController.prefetchCategoryQuestions(category, 'medium')
      )
    )

    this.store.dispatch({
      type: 'game/initialize',
      payload: {
        teams,
        categories,
        currentTeam: 'teamA',
        phase: 'game',
        timeLeft: 60,
        usedQuestions: new Set()
      }
    })
  }

  async handleAnswer(
    questionId: string,
    answer: string,
    timeLeft: number
  ): Promise<void> {
    const state = this.store.getState().game
    const question = state.currentQuestion

    if (!question || !state.currentTeam) return

    const result = await questionController.validateAnswer(question, answer)

    if (result.isCorrect) {
      // Add time bonus
      const timeBonus = Math.floor((timeLeft / 60) * 10)
      const totalPoints = result.points + timeBonus

      this.store.dispatch({
        type: 'game/updateScore',
        payload: {
          teamId: state.currentTeam,
          points: totalPoints
        }
      })
    }

    this.store.dispatch({
      type: 'game/setAnswer',
      payload: {
        isCorrect: result.isCorrect,
        feedback: result.feedback,
        points: result.points
      }
    })

    // Switch teams
    this.store.dispatch({
      type: 'game/switchTeam'
    })
  }

  saveGameState(): void {
    const state = this.store.getState().game
    localStorage.setItem('gameState', JSON.stringify(state))
  }

  loadGameState(): GameState | null {
    const savedState = localStorage.getItem('gameState')
    if (!savedState) return null

    try {
      const state = JSON.parse(savedState) as GameState
      this.store.dispatch({
        type: 'game/loadState',
        payload: state
      })
      return state
    } catch (error) {
      console.error('Error loading game state:', error)
      return null
    }
  }

  clearGameState(): void {
    localStorage.removeItem('gameState')
    questionController.clearCache()
    this.store.dispatch({ type: 'game/reset' })
  }
}

export const gameStateManager = new GameStateManager()