import axios from 'axios'
import type { Category, Question, ValidateAnswerResponse, GameState } from '../../types'

const API_BASE_URL = 'http://localhost:5000' // Update with your actual API URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface SelectCategoriesRequest {
  sessionId: string
  categories: string[]
}

export interface GenerateQuestionRequest {
  categoryId: string
  difficulty: string
  points: number
  subcategories?: string[]
}

export interface ValidateAnswerRequest {
  questionId: string
  answer: string
}

export const questionService = {
  selectCategories: async (data: SelectCategoriesRequest) => {
    // Implementation will be added when backend is ready
    throw new Error("Not implemented")
  },

  generateQuestion: async (data: GenerateQuestionRequest) => {
    // Implementation will be added when backend is ready
    throw new Error("Not implemented")
  },

  validateAnswer: async (_data: ValidateAnswerRequest): Promise<ValidateAnswerResponse> => {
    // Implementation will be added when backend is ready
    throw new Error("Not implemented")
  },

  getGameState: async (sessionId: string): Promise<GameState> => {
    // Implementation will be added when backend is ready
    throw new Error("Not implemented")
  },

  endSession: async (_sessionId: string) => {
    // Implementation will be added when backend is ready
    throw new Error("Not implemented")
  }
}
