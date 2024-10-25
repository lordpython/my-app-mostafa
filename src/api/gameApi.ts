// src/api/gameApi.ts

import axios from 'axios'
import { handleAPIError } from '../utils/errorHandler'
import type { Question, AnswerSubmission, GameState, Category } from '../types/game'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`
  }
})

export const gameApi = {
  generateQuestion: async (params: {
    categoryId: string
    difficulty: string
    points: number
    subcategories?: string[]
  }): Promise<Question> => {
    try {
      const response = await api.post('/questions/generate-question', params)
      return response.data
    } catch (error) {
      throw handleAPIError(error)
    }
  },

  validateAnswer: async (params: AnswerSubmission): Promise<{
    isCorrect: boolean
    feedback: string
    correctAnswer: string
    points: number
  }> => {
    try {
      const response = await api.post('/questions/validate-answer', params)
      return response.data
    } catch (error) {
      throw handleAPIError(error)
    }
  },

  getGameState: async (sessionId: string): Promise<GameState> => {
    try {
      const response = await api.get(`/questions/game-state?session_id=${sessionId}`)
      return response.data
    } catch (error) {
      throw handleAPIError(error)
    }
  },

  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await api.get('/categories')
      return response.data
    } catch (error) {
      throw handleAPIError(error)
    }
  },

  createGameSession: async (params: {
    teamA: string
    teamB: string
    selectedCategories: string[]
  }): Promise<{ sessionId: string }> => {
    try {
      const response = await api.post('/game-sessions', params)
      return response.data
    } catch (error) {
      throw handleAPIError(error)
    }
  }
}

export default gameApi